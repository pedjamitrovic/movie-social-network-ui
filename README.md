# movie-social-network-ui
 
User interface of social network which is geared towards cinematography fans.

Check out [movie-social-network](https://github.com/pedjamitrovic/movie-social-network) repo which represents WEB API of movie-social-network UI.

Documentation with images can be found on [movie-social-network-ui docs](https://github.com/pedjamitrovic/movie-social-network-ui/tree/master/doc).

![Movie social network UI](https://github.com/pedjamitrovic/movie-social-network-ui/blob/master/doc/img/responsive_combined.png?raw=true)

Registered users can create content (posts, comments), connect with other people and explore movies.

System uses Collaborative Filtering Recommendation System to generate personalized movie recommendations.

[TMDB API](https://www.themoviedb.org/documentation/api) is used as a source for cinematography data.

This product uses the [TMDB API](https://www.themoviedb.org/documentation/api) but is not endorsed or certified by TMDB.

## Technologies

Implemented in Angular.

ML.NET Matrix Factorization algorithm (Colaborative filtering) is used for generating movie recommendations.

Hangfire is used for scheduling and executing jobs for updating movie recommendations.

SignalR is used for real-time communication (chat, notifications) between API and connected clients.
