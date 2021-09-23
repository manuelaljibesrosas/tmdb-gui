## TMDb GUI concept

A simple GUI for a subset of the [TMDb API](https://developers.themoviedb.org/3/getting-started/introduction)

To run locally, install [nodejs](https://nodejs.org) and run

```bash
npm install && npm start
```

This will start a local development server at port 8081, to access the app from your phone, make sure that your phone is connected to the same network as your computer, then open the browser and go to `http://<your-computer-ip>:8081`

Please note that this app is __NOT responsive__ in its current version, and it's meant for devices with an aspect ratio close to 9:16 (~~any~~ most phones should be ok), running it on screens with an aspect ratio far from 9:16 is not supported and will break layout
