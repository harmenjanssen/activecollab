
# ActiveCollab API

## Install
> npm install activecollabjs

## Using
> ac.api(method, [options], [callback]);
>
> Use request options. More details [here](https://www.npmjs.com/package/request#requestoptions-callback)


```javascript
const ac = require('activecollabjs')();

ac.init({
  username: 'member@activecollab.com',
  password: 'Easy to remember, hard to guess',
  client_name: 'My Awesome App',
  client_vendor: 'ACME Inc',
  host: 'http://my.selfhost.com/activecollab/'
}, (err, response) => {
  let options = {
    json: true,
    method: 'POST',
    headers: [/* You can add custom headers */],
    body: {
      name: 'Task #1',
      labels: ['New','Deferred']
    }
  };

  ac.api('/projects/1/tasks', options, (err, response) => {
    console.log(response);
  });
});
```
