// You installed the `express` library earlier. For more information, see "[JavaScript example: Install dependencies](#javascript-example-install-dependencies)."
const express = require('express');
var {exec} = require('child_process');
const fs = require('fs');

// This initializes a new Express application.
const app = express();

// This defines a POST route at the `/webhook` path. This path matches the path that you specified for the smee.io forwarding. For more information, see "[Forward webhooks](#forward-webhooks)."
//
// Once you deploy your code to a server and update your webhook URL, you should change this to match the path portion of the URL for your webhook.
app.post('/webhook', express.json({type: 'application/json'}), (request, response) => {

  // Respond to indicate that the delivery was successfully received.
  // Your server should respond with a 2XX response within 10 seconds of receiving a webhook delivery. If your server takes longer than that to respond, then GitHub terminates the connection and considers the delivery a failure.
  response.status(202).send('Accepted');

  // Check the `x-github-event` header to learn what event type was sent.
  const githubEvent = request.headers['x-github-event'];
  const prepareHtml = async (branches) =>{
    let urlTable = `<table> <tr > <th>Branch Name</th> <th>Branch URL</th> </tr>`;

    for( branch of branches){
        if(branch.length > 0){
            //some logic to make URL
            const url = 'https://bundles-server-production.up.railway.app/'
            urlTable += `<tr><td>${branch}</td> <td><a href=${url}>${url}</td></a></tr>`
        }
    }
    urlTable += '</table>';

    fs.writeFileSync("branch-url.html", urlTable);

    console.log('created file "branch-url.html"');
}

  // You should add logic to handle each event type that your webhook is subscribed to.
  // For example, this code handles the `issues` and `ping` events.
  //
  // If any events have an `action` field, you should also add logic to handle each action that you are interested in.
  // For example, this code handles the `opened` and `closed` actions for the `issue` event.
  //
  // For more information about the data that you can expect for each event type, see "[AUTOTITLE](/webhooks/webhook-events-and-payloads)."
  if (githubEvent === 'issues') {
    const data = request.body;
    const action = data.action;
    if (action === 'opened') {
      console.log(`An issue was opened with this title: ${data.issue.title}`);
    } else if (action === 'closed') {
      console.log(`An issue was closed by ${data.issue.user.login}`);
    } else {
      console.log(`Unhandled action for the issue event: ${action}`);
    }
  } else if (githubEvent === 'ping') {
    console.log('GitHub sent the ping event');
  }else if (githubEvent === 'push') {
    exec('git branch',function(err,stdOut,stdErr){
        if(err) console.log(stdErr);
        // console.log(stdOut);
        const branches =   stdOut.split("\n").map((s) => s.trim());
        prepareHtml(branches);
    
    })
    console.log('GitHub sent the push event');
  } else {
    console.log(`Unhandled event: ${githubEvent}`);
  }
});

// This defines the port where your server should listen.
// 3000 matches the port that you specified for webhook forwarding. For more information, see "[Forward webhooks](#forward-webhooks)."
//
// Once you deploy your code to a server, you should change this to match the port where your server is listening.
const port = 3000;

// This starts the server and tells it to listen at the specified port.
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
