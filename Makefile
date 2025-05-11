build-image:
	docker build -t combination-finder-bykevin-work .

run-container:
	docker stop combination-finder-bykevin-work || true && docker rm combination-finder-bykevin-work || true &&  docker run --name combination-finder-bykevin-work -d \
		-p 8008:8008 \
		-e PORT=8008 \
		combination-finder-bykevin-work
