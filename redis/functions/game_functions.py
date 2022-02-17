from datetime import datetime
from distutils.util import execute
MAX_GAME = 150


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


class FindGameFunctionBuilder(BaseFunctionBuilder):
    def __init__(self):
        super().__init__(command_name='find_game')

    def register_command(self):
        """
            Determines finds public game to join to.

            Arguments:
                team
            Returns:
                redis key [Game:game_id]
            Trigger example:
                RG.TRIGGER find_game team1

        """

        def query():
            return execute(
                "FT.SEARCH", "GAME",
                # find GAMES that are not full (team count from 0 to max_count-1)
                f"'(@teamcount:[0 {MAX_GAME - 1}])'",
                "SORTBY", "teamcount", "DESC",  # order fullest game first
                "LIMIT", "0", "1")  # offset 0 take 1

            # "[1, 'GAME:f627c6d1cbd74be2a9569c3f7259dfa1', ['teamcount', '0', 'owner', 'TEAM:123', 'secret', 'secret123', 'private', '1']]"

        def find_game(team_id):
            game = query()
            if game != [0] and type(game) == list:
                return game[1].split(":")[1]

            # CREATE A NEW GAME IF THERE ARE NO GAMES
            game = execute("RG.TRIGGER", "create_new_game", f"TEAM:{team_id}")

            if game:
                return game[0]

        (
            GB('CommandReader')
                .map(lambda x: find_game(*x[1:]))
                 .register(trigger=self.command_name)
        )


class JoinGameFunctionBuilder(BaseFunctionBuilder):
    def __init__(self):
        super().__init__(command_name='join_game')

    def register_command(self):
        """
            Determines join the specific game.
                 - Assign Team to the Game.
                 - Increments team count
            Arguments:
                team, game, secret (optional)
            Returns:
                redis key [GAME:game_id]
            Trigger example:
                RG.TRIGGER join_game team1 game1
                RG.TRIGGER join_game team1 game1 secret123

        """

        def assign_to_game(team_id, game_id):
            # add team reference to the game
            execute("HSET", f"GAME:{game_id}", f"TEAM:{team_id}",int(datetime.now().timestamp()))
            execute("HSET", f"GAME:{game_id}", f"RUNNER:{team_id}", f"{0}")
            execute("HINCRBY", f"GAME:{game_id}", "teamcount", 1)
        
        def is_authorized(team_id, game_id, secret):
            return execute("RG.TRIGGER", "team_authorized", team_id, game_id, secret)

        def subcall(team_id, game_id, secret=""):
            if not is_authorized(team_id, game_id, secret):
                return False

            assign_to_game(team_id, game_id)
            execute('PUBLISH', game_id, f"jg;{team_id}")
            return game_id

        (
            GB('CommandReader')
                .map(lambda x: subcall(*x[1:]))
                .register(trigger=self.command_name)
        )


class LeaveGameFunctionBuilder(BaseFunctionBuilder):
    def __init__(self):
        super().__init__(command_name='leave_game')

    def register_command(self):
        """
            Determines leave the public game.
                 - Removes USER from the Game.
                 - Decrements teamcount
                 - Publishes a notification
            Arguments:
                team, game
            Returns:
                None
            Trigger example:
                RG.TRIGGER leave_game team1 game1
        """

        def subcall(team_id, game_id):
            execute("HDEL", f"GAME:{game_id}", f"TEAM:{team_id}")
            execute("HINCRBY", f"GAME:{game_id}", "teamcount", -1)
            execute("PUBLISH", game_id, f"lg;{team_id}")

        (
            GB('CommandReader')
                .map(lambda x: subcall(*x[1:]))
                .register(trigger=self.command_name, mode='sync')
        )


class GameAuthorizedFunctionBuilder(BaseFunctionBuilder):
    def __init__(self):
        super().__init__(command_name='team_authorized')

    def register_command(self):
        """
            Determines if team can join the game
            Arguments:
                tema, game
            Returns:
                Boolean
            Trigger example:
                RG.TRIGGER team_authorized team1 game1
        """

        def subcall(team_id, game_id, secret):
            return execute("HGET", f"GAME:{game_id}", "secret") == secret or execute("HGET", f"GAME:{game_id}",
                                                                                     f"TEAM:{team_id}") != 'None' or execute(
                "HGET", f"GAME:{game_id}", "owner") == f'TEAM:{team_id}'
 
        (
            GB('CommandReader')
                .map(lambda x: subcall(*x[1:]))
                .register(trigger=self.command_name, mode='sync')
        )


game_functions = [
    JoinGameFunctionBuilder(),
    LeaveGameFunctionBuilder(),
    FindGameFunctionBuilder(),
    GameAuthorizedFunctionBuilder()
]

for game_functions in game_functions:
    if not game_functions.is_registered():
        game_functions.register_command()
