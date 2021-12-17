var requestUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=23.09&lon=113.17&exclude=hourly&appid=db8406e2438a3bda2d57fa0aaa4169c2';
// ?per_page=5
// https://api.openweathermap.org/data/2.5/onecall?lat=23.09&lon=113.17&exclude=hourly,daily&appid=db8406e2438a3bda2d57fa0aaa4169c2
// API KEY: db8406e2438a3bda2d57fa0aaa4169c2
fetch(requestUrl)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log('Github Repo Issues \n----------');
    console.log(data);

    // // TODO: Loop through the response
    // for (var i = 0; i < 5; i++) {

    // // TODO: Console log each issue's URL and each user's login
    //   console.log(data[i]);
    //   console.log(data[i].html_url);
    //   console.log(data[i].user.login);
    // }
  });
