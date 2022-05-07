

export async function POSTRequest(url,body)
{
    let responseReturn
    await fetch(url, {
       method: 'POST',
       headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
       },
      body: JSON.stringify(body)
      }).then((response) => response.json())
            .then((responseJson) => {
                responseReturn = responseJson
    });
    return(responseReturn)
}

export async function GETRequest(url)
{

    let responseReturn
    await fetch(url, {
        method: 'GET',
        headers: {
                 Accept: 'application/json',
                 'Content-Type': 'application/json'
        },
       }).then((response) => response.json())
             .then((responseJson) => {
                 responseReturn = responseJson
     });
     return(responseReturn)
}

export async function PUTRequest(url,body)
{
    let responseReturn
    await fetch(url, {
        method: 'PUT',
        headers: {
                 Accept: 'application/json',
                 'Content-Type': 'application/json'
        },
       body: JSON.stringify(body)
       }).then((response) => response.json())
             .then((responseJson) => {
                 responseReturn = responseJson
     });
     return(responseReturn)
}

export async function DELETERequest(url)
{
    let responseReturn
    await fetch(url, {
        method: 'DELETE',
        headers: {
                 Accept: 'application/json',
                 'Content-Type': 'application/json'
        },
       }).then((response) => response.json())
             .then((responseJson) => {
                 responseReturn = responseJson
     });
     return(responseReturn)
}