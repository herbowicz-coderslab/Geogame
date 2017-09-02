import React from 'react';
import ReactDOM from 'react-dom';
import {
  Router,
  Route,
  Link,
  IndexLink,
  IndexRoute,
  hashHistory,
  browserHistory,
  } from 'react-router';

document.addEventListener('DOMContentLoaded', function(){

  class Main extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        content: <div></div>,
        img: '',
      }
    }

    render(){
      return <div className='test'>
        <button className=' btn menu-btn '><IndexLink to='/search'>Look for countries</IndexLink></button>
        <button className='btn menu-btn '><IndexLink to='/flags'>Play a flag game</IndexLink></button>
        <button className='btn menu-btn '><IndexLink to='/capitals'>Play a capital game</IndexLink></button>
        <button className='btn menu-btn '><IndexLink to='/continents'>Play a continent game</IndexLink></button></div>
    }
  }

  class Search extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        url: 'https://restcountries.eu/rest/v2/all',
        inputValue: '',
        country: {},
        obj: {},
        visible: false,
        clicked: false
      }
    }

    componentDidMount() {
      this.searchInput.focus();
      fetch(this.state.url).then(resp => {
        resp.json().then( element => {
          this.setState({obj: element});
        })
      });
    }

    handleTextChange = (e) => {
      this.setState({inputValue: e.target.value})
    }

    handleSubmit = (e) => {
      this.setState({clicked: true})
      e.preventDefault();
      this.setState({visible: false})
      this.state.obj.map((element) => {
        if (this.state.inputValue == element.name) {
          this.setState({country: element});
          this.setState({visible: true});
        }
      })
    }

    render() {
      if(this.state.visible)
      {
        return <div className='test'>
        <List name={this.state.country.name} region={this.state.country.region} subregion={this.state.country.subregion}
      flag={this.state.country.flag} code={this.state.country.alpha2Code} capital={this.state.country.capital}
      nativeName={this.state.country.nativeName} dom={this.state.country.topLevelDomain}/>
        <form onSubmit={this.handleSubmit}>
          <input type='text' name='search' onChange={this.handleTextChange} value={this.state.inputValue} autoComplete='off'/>
          <input type='submit' value='Szukaj' className='btn search-hide'/>
        </form>
        <button className='btn '><IndexLink to='/'>Menu</IndexLink></button></div>
      } else if(!this.state.visible && this.state.clicked) {
        return <div className='test'>
        <div className='warning'>There's no such country!</div>
        <form onSubmit={this.handleSubmit}>
          <input type='text' name='search' onChange={this.handleTextChange} value={this.state.inputValue} autoComplete='off' ref={(input) => { this.searchInput = input; }}/>
          <input type='submit' value='Szukaj' className='btn '/>
        </form>
        <button className='btn '><IndexLink to='/'>Menu</IndexLink></button></div>
      } else {
         return <div className='test'>
        <form onSubmit={this.handleSubmit}>
          <input type='text' name='search' onChange={this.handleTextChange} value={this.state.inputValue} autoComplete='off' ref={(input) => { this.searchInput = input; }}/>
          <input type='submit' value='Szukaj' className='btn '/>
        </form>
        <button className='btn '><IndexLink to='/'>Menu</IndexLink></button></div>

      }
    }
  }

  class List extends React.Component {
    render() {
      if (this.props.region == 'Americas') {
        return <ul className='animation'><li>Name: {this.props.name}</li>
                   <li>Capital: {this.props.capital}</li>
                   <li>Continent: {this.props.subregion}</li>
                   <li>2 letters code: {this.props.code}</li>
                   <li>Domain: {this.props.dom}</li>
                   <li><img src={this.props.flag} alt={this.props.code}/></li>
                   <li>Native name: {this.props.nativeName}</li></ul>
      } else {
        return <ul className='overflow'><li>Name: {this.props.name}</li>
                   <li>Capital: {this.props.capital}</li>
                   <li>Continent: {this.props.region}</li>
                   <li>Region: {this.props.subregion}</li>
                   <li>2 letters code: {this.props.code}</li>
                   <li>Domain: {this.props.dom}</li>
                   <li><img src={this.props.flag} alt={this.props.code}/></li>
                   <li>Native name: {this.props.nativeName}</li></ul>
      }

    }
  }

  class FlagGame extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        url: 'https://restcountries.eu/rest/v2/all',
        content: <h1 className='loading'>Loading</h1>,
        obj: {},
        points: 0,
        easy: {},
        medium: {},
        hard: {}
      }
    }

    componentDidMount() {
      let easy = [];
      let medium = [];
      let hard = [];
      this.setState({content: <div className='test'><button onClick={this.handleStart} className='btn '>Start!</button>
      <button className='btn '><IndexLink to='/'>Menu</IndexLink></button></div>})
      fetch(this.state.url).then(resp => {
        resp.json().then( element => {
          this.setState({obj: element});
          this.setState({hard: element})
          element.map((el) => {
            if (el.region == 'Europe') {
              easy.push(el);
            }
            if (el.region == 'Europe' || el.region == 'Americas' || el.region == 'Asia') {
              medium.push(el);
            }
          })
          this.setState({easy: easy});
          this.setState({medium: medium});
        })
      });
    }

    getPoints = (result) => {
      this.setState({points: result})
    }

    gameStop = () => {
      this.setState({content: <div className='test'>
        <div className='result'>You stoped the game! Your result: {this.state.points} points</div>
        <button className='btn ' onClick={this.handleStart}>Try again</button>
        <button className='btn '><IndexLink to='/'>Menu</IndexLink></button>
      </div>})
    }

    timeEnd = () => {
      this.setState({content: <div className='test'>
        <div className='result'>Time's up! Your result: {this.state.points} points</div>
        <button className='btn ' onClick={this.handleStart}>Try again</button>
        <button className='btn '><IndexLink to='/'>Menu</IndexLink></button>
      </div>})
    }

    handleStart = () => {
      this.setState({content: <FlagGameOn object={this.state.obj}
        stopGame={this.gameStop} getPoints={this.getPoints} timeEnd={this.timeEnd} easy={this.state.easy}
        medium={this.state.medium} hard={this.state.hard}/>});
    }
    render(){
      return <div className='test2 test3'>
        {this.state.content}</div>
    }
  }

  class FlagGameOn extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        points: 0,
        time: 60000,
        input: '',
        number: 0,
        name: '',
        flag: ''
      }
    }

    getFlag = () => {
  let rnd = 0;
  rnd = Math.floor(Math.random() * 52);
  if (this.state.points <= 7) {
    rnd = Math.floor(Math.random() * 52);
    this.setState({number: rnd});
    this.setState({
      flag: this.props.easy[this.state.number].flag.toString()
    });
    let countryName = this.props.easy[this.state.number].name.toString();
    this.setState({name: countryName})
    if (countryName.indexOf(',') > 0 ){
      this.setState({
        name: countryName.substr(0, countryName.indexOf(','))
      });
    }
    if (countryName.indexOf('(') > 0){
      this.setState({
        name: countryName.substr(0, countryName.indexOf('('))
      });
    }
  } else if (this.state.points <= 14) {
    rnd = Math.floor(Math.random() * 159);
    this.setState({number: rnd});
    this.setState({
      flag: this.props.medium[this.state.number].flag.toString()
    })
    let countryName = this.props.medium[this.state.number].name.toString();
    this.setState({name: countryName})
    if (countryName.indexOf(',') > 0) {
      this.setState({
        name: countryName.substr(0, countryName.indexOf(','))
      });
    }
    if (countryName.indexOf('(') > 0) {
      this.setState({
        name: countryName.substr(0, countryName.indexOf('('))
      });
    }
  } else {
    rnd = Math.floor(Math.random() * 249);
    this.setState({number: rnd});
    this.setState({
      flag: this.props.hard[this.state.number].flag.toString()
    })
    let countryName = this.props.hard[this.state.number].name.toString();
    this.setState({name: countryName})
    if (countryName.indexOf(',') > 0) {
      this.setState({
        name: countryName.substr(0, countryName.indexOf(','))
      });
    }
    if (countryName.indexOf(')') > 0) {
      this.setState({
        name: countryName.substr(0, countryName.indexOf(')'))
      });
    }
  }
}

    componentDidMount() {
      this.flagInput.focus();
      this.getFlag();
      this.intervalId = setInterval(() => {
        this.setState({time: this.state.time-1000})
        if (this.state.time <= 0) {
          clearInterval(this.intervalId);
          this.props.timeEnd();
        }
      }, 1000);
    }

    componentWillUnmount() {
      clearInterval(this.intervalId)
    }

    handleInputChange = (e) => {
      this.setState({input: e.target.value})
    }



    nextQuestion = (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.getFlag();
      this.setState({input: ''});
      this.flagInput.focus();
      console.log(this.state.name);
    }

    handleCheck = (e) => {
      e.preventDefault();
      if (this.state.input == this.state.name) {
        this.setState({points: this.state.points+1});
        this.props.getPoints(this.state.points+1);
        this.getFlag();
        this.setState({time: this.state.time+3000})
        this.setState({input: ''});
        this.flagInput.focus();
        console.log(this.state.name);
      } else {
        this.setState({points: this.state.points-1});
        this.props.getPoints(this.state.points-1);
        this.getFlag();
        this.setState({input: ''});
        this.flagInput.focus();
        console.log(this.state.name);
      }
    }

    render() {
      return <div className='test'>
          <div className='gameinfos'>
            <div className='gameinfo'>Points: {this.state.points}</div>
            <div className='gameinfo'>Timer: {this.state.time/1000}</div>
          </div>
          <img  src={this.state.flag}/>
          <form onSubmit={this.handleCheck}>
          <input type='text' onChange={this.handleInputChange} value={this.state.input} ref={(input) => { this.flagInput = input; }}/>
          <div className='test2'>
          <input type='submit' className='btn hide' value='Check'/>
          <button onClick={this.nextQuestion} className='btn hide'>Next</button>
          </div>
          </form>
        <button className='btn hide' onClick={this.props.stopGame}>End</button>
      </div>
    }
  }

  class CapitalGame extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        url: 'https://restcountries.eu/rest/v2/all',
        content: <h1 className='loading'>Loading</h1>,
        obj: {},
        points: 0,
        easy: [],
        medium: [],
        hard: []
      }
    }

    componentDidMount() {
      let easy = [];
      let medium = [];
      let hard = [];
      this.setState({content: <div className='test'><button onClick={this.handleStart} className='btn '>Start!</button>
                              <button className='btn '><IndexLink to='/'>Menu</IndexLink></button></div>})
      fetch(this.state.url).then(resp => {
        resp.json().then( element => {
          this.setState({obj: element});
          this.setState({hard: element})
          element.map((el) => {
            if (el.region == 'Europe') {
              easy.push(el);
            }
            if (el.region == 'Europe' || el.region == 'Americas' || el.region == 'Asia') {
              medium.push(el);
            }
          })
          this.setState({easy: easy});
          this.setState({medium: medium});
        })
      });
    }

    getPoints = (result) => {
      this.setState({points: result})
    }

    gameStop = () => {
      this.setState({content: <div className='test'>
        <div className='result'>You ended the game! Your result is: {this.state.points}</div>
        <button className='btn ' onClick={this.handleStart}>Try again</button>
        <button className='btn '><IndexLink to='/'>Menu</IndexLink></button>
      </div>})
        console.log(this.state.obj);
    }

    timeEnd = () => {
      this.setState({content: <div className='test'>
        <div className='result'>Time's up! Your result is: {this.state.points}</div>
        <button className='btn ' onClick={this.handleStart}>Try again</button>
        <button className='btn '><IndexLink to='/'>Menu</IndexLink></button>
      </div>})
    }

    handleStart = () => {
      this.setState({content: <CapitalGameOn object={this.state.obj}
        stopGame={this.gameStop} getPoints={this.getPoints} timeEnd={this.timeEnd} easy={this.state.easy}
        medium={this.state.medium} hard={this.state.hard}/>})
    }
    render(){
      return <div className='test2 test3'>
        <div>{this.state.content}</div></div>
    }
  }

  class CapitalGameOn extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        points: 0,
        time: 60000,
        input: '',
        number: 0,
        name: '',
        capital: ''
      }
    }

    getCapital = () => {
  let rnd = 0;
  rnd = Math.floor(Math.random() * 52);
  if (this.state.points <= 7) {
    rnd = Math.floor(Math.random() * 52);
    this.setState({number: rnd});
    this.setState({
      capital: this.props.easy[this.state.number].capital.toString()
    });
    let countryName = this.props.easy[this.state.number].name.toString();
    this.setState({name: countryName})
    if (countryName.indexOf(',') > 0 ){
      this.setState({
        name: countryName.substr(0, countryName.indexOf(','))
      });
    }
    if (countryName.indexOf('(') > 0){
      this.setState({
        name: countryName.substr(0, countryName.indexOf('('))
      });
    }
  } else if (this.state.points <= 14) {
    rnd = Math.floor(Math.random() * 159);
    this.setState({number: rnd});
    this.setState({
      capital: this.props.medium[this.state.number].capital.toString()
    })
    let countryName = this.props.medium[this.state.number].name.toString();
    this.setState({name: countryName})
    if (countryName.indexOf(',') > 0) {
      this.setState({
        name: countryName.substr(0, countryName.indexOf(','))
      });
    }
    if (countryName.indexOf('(') > 0) {
      this.setState({
        name: countryName.substr(0, countryName.indexOf('('))
      });
    }
  } else {
    rnd = Math.floor(Math.random() * 249);
    this.setState({number: rnd});
    this.setState({
      capital: this.props.hard[this.state.number].capital.toString()
    })
    let countryName = this.props.hard[this.state.number].name.toString();
    this.setState({name: countryName})
    if (countryName.indexOf(',') > 0) {
      this.setState({
        name: countryName.substr(0, countryName.indexOf(','))
      });
    }
    if (countryName.indexOf(')') > 0) {
      this.setState({
        name: countryName.substr(0, countryName.indexOf(')'))
      });
    }
  }
}



    componentDidMount() {
      this.capitalInput.focus();
      this.getCapital();
      this.intervalId = setInterval(() => {
        this.setState({time: this.state.time-1000})
        if (this.state.time <= 0) {
          clearInterval(this.intervalId);
          this.props.timeEnd();
        }
      }, 1000);
    }

    componentWillUnmount() {
      clearInterval(this.intervalId)
    }

    handleInputChange = (e) => {
      this.setState({input: e.target.value})
    }

    nextQuestion = (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.getCapital();
      this.setState({input: ''});
      this.capitalInput.focus();
      console.log(this.state.capital);
    }

    handleCheck = (e) => {
      e.preventDefault();
      if (this.state.input == this.state.capital) {
        this.setState({points: this.state.points+1});
        this.props.getPoints(this.state.points+1);
        this.getCapital();
        this.setState({time: this.state.time+3000})
        this.setState({input: ''});
        this.capitalInput.focus();
        console.log(this.state.capital);
      } else {
        this.setState({points: this.state.points-1});
        this.props.getPoints(this.state.points-1);
        this.getCapital();
        this.setState({input: ''});
        this.capitalInput.focus();
        console.log(this.state.capital);
      }
    }

    render() {
      return <div className='test'>
          <div className='gameinfos'>
            <div className='gameinfo'>Points: {this.state.points}</div>
            <div className='gameinfo'>Timer: {this.state.time/1000}</div>
          </div>
          <div className = 'question'>{this.state.name}</div>
          <form onSubmit={this.handleCheck}>
          <input type='text' onChange={this.handleInputChange} value={this.state.input} ref={(input) => { this.capitalInput = input; }}/>
          <div className='test2'>
          <input type='submit' className='btn hide' value='Check'/>
          <button onClick={this.nextQuestion} className='btn hide'>Next</button>
          </div>
          </form>

        <button className='btn hide' onClick={this.props.stopGame}>End</button></div>
    }
  }

  class ContinentGame extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        url: 'https://restcountries.eu/rest/v2/all',
        content: <h1 className='loading'>Loading</h1>,
        obj: {},
        points: 0,
        easy: [],
        medium: [],
        hard: []
      }
    }

    componentDidMount() {
      let easy = [];
      let medium = [];
      let hard = [];
      this.setState({content: <div className='test'><button onClick={this.handleStart} className='btn '>Start!</button>
                              <button className='btn '><IndexLink to='/'>Menu</IndexLink></button></div>})
      fetch(this.state.url).then(resp => {
        resp.json().then( element => {
          this.setState({obj: element});
          this.setState({hard: element})
          element.map((el) => {
            if (el.region == 'Europe') {
              easy.push(el);
            }
            if (el.region == 'Europe' || el.region == 'Americas' || el.region == 'Asia') {
              medium.push(el);
            }
          })
          this.setState({easy: easy});
          this.setState({medium: medium});
        })
      });
    }

    getPoints = (result) => {
      this.setState({points: result})
    }

    gameStop = () => {
      this.setState({content: <div className='test'>
        <div className='result'>You ended the game! {'\n'} Your result is: {this.state.points}</div>
        <button className='btn ' onClick={this.handleStart}>Try again</button>
        <button className='btn '><IndexLink to='/'>Menu</IndexLink></button>
      </div>})
    }

    timeEnd = () => {
      this.setState({content: <div className='test'>
        <div className='result'>Time's up! {'\n'} Your result is: {this.state.points}</div>
        <button className='btn ' onClick={this.handleStart}>Try again</button>
        <button className='btn '><IndexLink to='/'>Menu</IndexLink></button>
      </div>})
    }

    handleStart = () => {
      this.setState({content: <ContinentGameOn object={this.state.obj}
        stopGame={this.gameStop} getPoints={this.getPoints} timeEnd={this.timeEnd} easy={this.state.easy}
        medium={this.state.medium} hard={this.state.hard}/>})
    }
    render(){
      return <div className='test2 test3'>
        <div>{this.state.content}</div></div>
    }
  }

  class ContinentGameOn extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        points: 0,
        time: 60000,
        obj: {},
        input: '',
        number: 0,
        name: '',
        continent: ''
      }
    }


    getContinent = () => {
  let rnd = 0;
  rnd = Math.floor(Math.random() * 159);
   if (this.state.points <= 15) {
    rnd = Math.floor(Math.random() * 159);
    this.setState({number: rnd});
    this.setState({
      continent: this.props.medium[this.state.number].region.toString()
    })
    let countryName = this.props.medium[this.state.number].name.toString();
    this.setState({name: countryName})
    if (countryName.indexOf(',') > 0) {
      this.setState({
        name: countryName.substr(0, countryName.indexOf(','))
      });
    }
    if (countryName.indexOf('(') > 0) {
      this.setState({
        name: countryName.substr(0, countryName.indexOf('('))
      });
    }
  } else {
    rnd = Math.floor(Math.random() * 249);
    this.setState({number: rnd});
    this.setState({
      continent: this.props.hard[this.state.number].region.toString()
    })
    let countryName = this.props.hard[this.state.number].name.toString();
    this.setState({name: countryName})
    if (countryName.indexOf(',') > 0) {
      this.setState({
        name: countryName.substr(0, countryName.indexOf(','))
      });
    }
    if (countryName.indexOf(')') > 0) {
      this.setState({
        name: countryName.substr(0, countryName.indexOf(')'))
      });
    }
  }}

    componentDidMount() {
      this.continentInput.focus();
      this.getContinent();
      this.intervalId = setInterval(() => {
        this.setState({time: this.state.time-1000})
        if (this.state.time <= 0) {
          clearInterval(this.intervalId);
          this.props.timeEnd();
        }
      }, 1000);
    }

    componentWillUnmount() {
      clearInterval(this.intervalId)
    }

    handleInputChange = (e) => {
      this.setState({input: e.target.value})
    }

    nextQuestion = (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.getContinent();
      this.setState({input: ''});
      this.continentInput.focus();
      console.log(this.state.continent);
    }

    handleCheck = (e) => {
      e.preventDefault();
      if (this.state.input == this.state.continent) {
        this.setState({points: this.state.points+1});
        this.props.getPoints(this.state.points+1);
        this.getContinent();
        this.setState({time: this.state.time+3000});
        this.setState({input: ''});
        this.continentInput.focus();
        console.log(this.state.continent);
      } else {
        this.setState({points: this.state.points-1});
        this.props.getPoints(this.state.points-1);
        this.getContinent();
        this.setState({input: ''});
        this.continentInput.focus();
        console.log(this.state.continent);
      }
    }

    render() {
      return <div className='test'>
          <div className='gameinfos'>
            <div className='gameinfo'>Points: {this.state.points}</div>
            <div className='gameinfo'>Timer: {this.state.time/1000}</div>
          </div>
          <div className = 'question'>{this.state.name}</div>
          <form onSubmit={this.handleCheck}>
          <input type='text' onChange={this.handleInputChange} value={this.state.input} ref={(input) => { this.continentInput = input; }} />
          <div className='test2'>
          <input type='submit' value='Check' className='btn hide'/>
          <button onClick={this.nextQuestion} className='btn hide'>Next</button>
          </div>
          </form>
        <button className='btn hide' onClick={this.props.stopGame}>End</button></div>
    }
  }


  class App extends React.Component {
    render() {
      return  <Router history={hashHistory}>
            <Route path='/' component={Main}></Route>
            <Route path='/flags' component={FlagGame}></Route>
            <Route path='/capitals' component={CapitalGame}></Route>
            <Route path='/continents' component={ContinentGame}></Route>
            <Route path='/search' component={Search}></Route>
        </Router>

    }
  }

  ReactDOM.render(
    <App />,
    document.getElementById('app')
  );
})
