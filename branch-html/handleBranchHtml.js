var {exec} = require('child_process');
const fs = require('fs');

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

exec('git branch',function(err,stdOut,stdErr){
    if(err) console.log(stdErr);
    // console.log(stdOut);
    const branches =   stdOut.split("\n").map((s) => s.trim());
    prepareHtml(branches);
    

})