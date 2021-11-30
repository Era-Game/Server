aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws/d4d0g6d3
docker build -t era-game-server .
docker tag era-game-server:latest public.ecr.aws/d4d0g6d3/era-game-server:latest
docker push public.ecr.aws/d4d0g6d3/era-game-server:latest
