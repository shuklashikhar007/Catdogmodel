<h1 align="center">Cat Dog Classifier</h1>

1. Cat-Dog classifier based on `pre-trained` model (MobileNet).
2. This repo contains model prepration, backed, and web frontend code.
3. You can test the model by visiting [cat-dog.tanishqsingh.com](https://cat-dog.tanishqsingh.com) and uploading a image.
4. Frontend is deployed in `vercel`, where as backend is dockerized and deployed to `google cloud run`.
5. And the minimum instances is set to 0, so your first image may take some time as the server will `cold start`.
6. To solve this, frontend make a `get` request to server as soon as someone vists the site, to start the server.