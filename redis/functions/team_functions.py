from datetime import datetime
MAX_PLAYERS_IN_GAME = 1000


class BaseFunctionBuilder():
    def __init__(self, command_name):
        self.command_name = command_name

    def is_registered(self):
        """
            Determines if function is already registered in redis database.
            Makes a `RG.DUMPREGISTRATIONS` call. Seeks for match between self.command_name and RegistrationData arguments.
            Returns:
                is registered (boolean)
        """
        dumped_registrations = execute("RG.DUMPREGISTRATIONS")

        if not dumped_registrations:
            return False

        for registration in dumped_registrations:
            data = dict(zip(registration[0::2], registration[1::2]))
            registration_data = dict(
                zip(data['RegistrationData'][0::2], data['RegistrationData'][1::2]))
            if self.command_name in registration_data['args']:
                return True

        return False

    def register_command(self):
        """
            Registers a redis gears function to redis.
            This is a super class placeholder function meant to be overridden.

            Raises:
                NotImplementedError()
        """
        raise NotImplementedError(self.__class__.__name__)


class FindTeamFunctionBuilder(BaseFunctionBuilder):
    def __init__(self):
        super().__init__(command_name='find_team')

    def register_command(self):
        """
            Determines finds public team to join to.

            Arguments:
                user
            Returns:
                redis key [TEAM:team_id]
            Trigger example:
                RG.TRIGGER find_team user1

        """

        def query():
            return execute(
                "FT.SEARCH", "TEAM",
                # find GAMES that are not full (player count from 0 to max_count-1)
                f"'(@playercount:[0 {MAX_PLAYERS_IN_GAME - 1}])'",
                "SORTBY", "playercount", "DESC",  # order fullest teams first
                "LIMIT", "0", "1")  # offset 0 take 1

            # "[1, 'TEAM:f627c6d1cbd74be2a9569c3f7259dfa1', ['playercount', '0', 'owner', 'USER:123', 'secret', 'secret123', 'private', '1']]"

        def find_team(user_id):
            team = query()
            if team != [0] and type(team) == list:
                return team[1].split(":")[1]

            # CREATE A NEW GAME IF THERE ARE NO GAMES
            team = execute("RG.TRIGGER", "create_new_team", f"USER:{user_id}")

            if team:
                return team[0]

        (
            GB('CommandReader')
                .map(lambda x: find_team(*x[1:]))
                 .register(trigger=self.command_name)
        )


class JoinTeamFunctionBuilder(BaseFunctionBuilder):
    def __init__(self):
        super().__init__(command_name='join_team')

    def register_command(self):
        """
            Determines join the specific team.
                 - Assign User to the Team.
                 - Increments player count
            Arguments:
                user, team, secret (optional)
            Returns:
                redis key [TEAM:team_id]
            Trigger example:
                RG.TRIGGER join_team user1 team1
                RG.TRIGGER join_team user1 team1 secret123

        """

        def assign_to_team(user_id, team_id):
            # add user reference to the team
            execute("HSET", f"TEAM:{team_id}", f"USER:{user_id}", int(datetime.now().timestamp()))
            execute("HINCRBY", f"TEAM:{team_id}", "playercount", 1)
        
        def is_authorized(user_id, team_id, secret):
            return execute("RG.TRIGGER", "user_authorized", user_id, team_id, secret)

        def subcall(user_id, team_id, secret=""):
            if not is_authorized(user_id, team_id, secret):
                return False

            assign_to_team(user_id, team_id)
            execute('PUBLISH', team_id, f"j;{user_id}")
            return team_id

        (
            GB('CommandReader')
                .map(lambda x: subcall(*x[1:]))
                .register(trigger=self.command_name)
        )


class LeaveTeamFunctionBuilder(BaseFunctionBuilder):
    def __init__(self):
        super().__init__(command_name='leave_team')

    def register_command(self):
        """
            Determines leave the public room.
                 - Removes USER from the ROOM.
                 - Decrements playercount
                 - Publishes a notification
            Arguments:
                user, team
            Returns:
                None
            Trigger example:
                RG.TRIGGER leave_team user1 team1
        """

        def subcall(user_id, team_id):
            execute("HDEL", f"TEAM:{team_id}", f"USER:{user_id}")
            execute("HINCRBY", f"TEAM:{team_id}", "playercount", -1)
            execute("PUBLISH", team_id, f"l;{user_id}")

        (
            GB('CommandReader')
                .map(lambda x: subcall(*x[1:]))
                .register(trigger=self.command_name, mode='sync')
        )


class UserAuthorizedFunctionBuilder(BaseFunctionBuilder):
    def __init__(self):
        super().__init__(command_name='user_authorized')

    def register_command(self):
        """
            Determines if user can join the room
            Arguments:
                user, team
            Returns:
                Boolean
            Trigger example:
                RG.TRIGGER user_authorized user1 team1
        """

        def subcall(user_id, team_id, secret):
            return execute("HGET", f"TEAM:{team_id}", "secret") == secret or execute("HGET", f"TEAM:{team_id}",
                                                                                     f"USER:{user_id}") != 'None' or execute(
                "HGET", f"TEAM:{team_id}", "owner") == f'USER:{user_id}'

        (
            GB('CommandReader')
                .map(lambda x: subcall(*x[1:]))
                .register(trigger=self.command_name, mode='sync')
        )


team_functions = [
    JoinTeamFunctionBuilder(),
    LeaveTeamFunctionBuilder(),
    FindTeamFunctionBuilder(),
    UserAuthorizedFunctionBuilder()
]

for team_function in team_functions:
    if not team_function.is_registered():
        team_function.register_command()
