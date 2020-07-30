import React from 'react';

import './App.css';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      wikiSearchReturnValues: [],
      wikiSearchTerms: ''
    }
  }

  useWikiSearchEngine =(e) =>{
    e.preventDefault();
    this.setState({
      wikiSearchReturnValues : []
    });

    const pointerToThis = this;
    var url = "https://en.wikipedia.org/w/api.php";

    var params = {
      action: "query",
      list: "search",
      srsearch: this.state.wikiSearchTerms,
      format: 'json'
    };

    url = url+"?origin=*";
    Object.keys(params).forEach((key) => {
      url += "&" + key +"="+ params[key];

    });

    fetch(url)
      .then(
        function(response){
          return response.json();
        }
      )
    
      .then(
        function(response){
         
          for(var key in response.query.search){
              pointerToThis.state.wikiSearchReturnValues.push({
              queryResultPageFullUrl : "no link",
              queryResultPageID: response.query.search[key].pageid,
              queryResultPageTitle: response.query.search[key].title,
              queryResultPageSnippet: response.query.search[key].snippet
             

            });

          }
        }
      )
      .then(
        function(response){
          for (var key2 in pointerToThis.state.wikiSearchReturnValues){
            let page = pointerToThis.state.wikiSearchReturnValues[key2];
            let pageID = page.queryResultPageID;
            let urlForRetrievingPageUrlByPageID = "https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=info&pageids="+pageID+"&inprop=url&format=json";

            fetch(urlForRetrievingPageUrlByPageID)
            .then(
              function(response){
                return response.json();             
              }
            )
            .then(
              function(response){
                page.queryResultPageFullUrl = response.query.pages[pageID].fullurl;
                pointerToThis.forceUpdate();
              }
            )
          }
        }
      )
  }
  changeWikiSearchTerms = (e) => {
    this.setState({
      wikiSearchTerms: e.target.value
    });
  }




  render(){

    let wikiSearchResults =[];
    //console.log(this.state.wikiSearchReturnValues);
    for (var key3 in this.state.wikiSearchReturnValues){
      wikiSearchResults.push(
        <div className="searchResultDiv" key ={key3}>
          <h3><a href ={this.state.wikiSearchReturnValues[key3].queryResultPageFullUrl}>{this.state.wikiSearchReturnValues[key3].queryResultPageTitle}</a></h3>
          <span className="link"><a href={this.state.wikiSearchReturnValues[key3].queryResultPageFullUrl}>this.state.wikiSearchReturnValues[key3].queryResultPageFullUrl</a></span>
          <p className="description" dangerouslySetInnerHTML={{__html: this.state.wikiSearchReturnValues[key3].queryResultPageFullUrlPageSnippet}}  ></p>  
        </div>
      )
    }

    

    return (
      <div className="App">
        <h1>Wikipedia search engine</h1>
        <form action ="">
          <input type="text" value={this.state.wikiSearchTerms || ''} onChange={this.changeWikiSearchTerms} plaseholder="Search for article" />
          <button type="submit" onClick={this.useWikiSearchEngine}>Search</button>
        </form>
        {wikiSearchResults}
      </div>
    );

  }
  
}

export default App;
