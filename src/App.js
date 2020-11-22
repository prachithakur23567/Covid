

import React from "react"
import {useState,useEffect} from "react"
import './App.css';
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent
  

} from "@material-ui/core";
import InfoBox from "./InfoBox.js";
import Map from "./Map";
import Table from "./Table";
import {sortData,prettyPrintStat} from "./util.js";
import LineGraph from "./LineGraph.js";
import "leaflet/dist/leaflet.css";



function App() {

  const [countries,setCountries]=useState([]);
  const[country,setCountry]=useState('worldwide')
  const[countryInfo,setCountryInfo]=useState({})
  const[tableData,setTableData]=useState([])
  const [mapCenter,setMapCenter]=useState({lat:34.80746,lng:-40.4796})
  const [mapZoom,setMapZoom]=useState(3);
  const [mapCountries,setMapCountries]=useState([])
  useEffect(()=>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response)=>response.json())
    .then((data)=>{
      setCountryInfo(data)
    })
  })


  useEffect(() =>{

    //CODE HERE WILL BE EXECUTED ONCE when the COMPONENTS RUNS AND NOT AGAIN INDICATED BY THE SQUARE BRACKETS
    //async function is use why ? send req to the server,wait,do something with the input
    //EXPALINATION OF THE FUNCTION:async function is fetching data from the end point and after when we receive response then command is used and the thing is stored in response then with the help of data we used a map function and that is use to pull out the name and value from json file the response that we get is json file from the end point


    const getCountriesData=async()=>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response)=>response.json())//WE WANT THAT RESPONSE TO GET CONVERTED IN JSON FORMAT
      .then ((data)=>{ //HERE THE JSON THEN BECOMES DATA WE ARE USING DATA FROM JSON
        const countries=data.map((country)=>(
          {
              name:country.country,
              value:country.countryInfo.iso2,
          }
        ))

        console.log("GHUUU ",data)

        const sortedData=sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries); 
      })    }

    getCountriesData();
  },[])

  const onCountryChange=async (event)=>{
    const countryCode=event.target.value;
    console.log("YOOOOOOOOO>>>>",countryCode);

    const url=
      countryCode==="worldwide"
      ? "https://disease.sh/v3/covid-19/all"
      :`https://disease.sh/v3/covid-19/countries/${countryCode}`

    
    
      
      await fetch(url)        //AWAIT FUNCTION IS ALSWAYS USED WITHIN ASYNC FUCNTION
    .then((response)=>response.json())
    .then((data)=>{

     

      //console.log("MAP DATA>>>>>>>>>",data)

      setCountry(countryCode);

      //ALL OF THE DATA FROM COUNTRY RESPOMSE
      setCountryInfo(data);
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
      

      

      
    })
    
  }
  console.log("COUNTRY INFO>>>>",countryInfo)
  return (


    //BEM NAMING CONVENTION


    //API END POINT:https://disease.sh/v3/covid-19/countries

    //USEEFFECT:RUNS A PIECE OF CODE FOR A GIVEN CONDITION



    
    


    <div className="app">

        <div className="app__left">

          {/* Header */}
          {/* Title and WorldWide */}

          {/* InfoBoxes */}
          {/* InfoBoxes */}
          {/* InfoBoxes */}

           {/* Map */}

            <div className="app__header">

                <h1>
                  Covid-19 Tracker
                </h1>

                <FormControl className="app__dropDown">

                

                  <Select variant="outlined" value={country} onClick={onCountryChange}>
                  <MenuItem value="worldwide">Worldwide</MenuItem>

                          

            {/* Loop through All the Countries And Show the DropDown */}

                  {
                    countries.map(country=>(

                      <MenuItem value={country.value}>{country.name}</MenuItem>

                    ))
                  }

                {/* <MenuItem value="worldwide">Worldwide</MenuItem>
                <MenuItem value="worldwide">Option 2</MenuItem>
                <MenuItem value="worldwide">Option 3</MenuItem>
                <MenuItem value="worldwide">Option 4</MenuItem> */}
                  </Select>

                </FormControl>

            </div>

            <div className="app__stats">
                {/* TODAY CASES WE ARE GETTING FROM API CALL */}

              <InfoBox title="Coronavirus Cases" cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)} /> 
              <InfoBox title="Recovered" total={prettyPrintStat(countryInfo.recovered)}  cases={prettyPrintStat(countryInfo.todayRecovered)} />
              <InfoBox title="Deaths" total={prettyPrintStat(countryInfo.deaths)} cases={prettyPrintStat(countryInfo.todayDeaths)} />

              {/* InfoBoxes */}
              {/* InfoBoxes */}
              {/* InfoBoxes */}


            </div>

            <Map 

                center={mapCenter}
                zoom={mapZoom}
                countries={mapCountries}
             />

        </div>

        <Card className="app__right">

                  <CardContent>
                    <h3>
                      Live Cases By Country
                      <Table countries={tableData} />
                      {/* Table */}
                    </h3>
                    <h3>Worldwide New Cases</h3>

                    <LineGraph />
                    
                     {/* Graph */}
                  </CardContent>

                       
                      
        </Card>
        

    



    
    </div>
  );
}

export default App;
