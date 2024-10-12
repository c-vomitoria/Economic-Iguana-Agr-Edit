// ==UserScript==
// @name         Economic Iguana
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Makes a new page for NationStates!
// @author       Spode Humbled Minions / Mechanocracy
// @match        https://www.nationstates.net/nation=*
// @icon         https://docs.google.com/drawings/d/e/2PACX-1vQGzMhE04JdHTcCMtGxUmx0RPtRQQuWejzySqAxYoUK0sREOdkkyjk-LN6sueGT48jaqIKfrXitgdEx/pub?w=480&h=480
// @grant        none

// ==/UserScript==

(function() {
    'use strict';

    //Function to call the library we need later
        function loadScript(url, callback) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onload = callback;
        document.head.appendChild(script);
    }

    //Find what the nation the user is looking at, and some general information about it
    const currentURL = window.location.href;
    const nationGetRegex = new RegExp("nation=([^\/]+)");
    const nationFlagLinkRegexUpload = new RegExp("uploads\/(.+)");
    const nationFlagLinkRegexDefault = new RegExp("flags\/(.+)");
    const nationViewedForURL = currentURL.match(nationGetRegex)[1];

    let uploadBool = true

    //If we're on any other valid page BUT our custom one
    if(!currentURL.includes("/page=blank/econ_sectors")){

        //Infoscraping to send information over to our new custom page
        const nationViewedWithCapitalization = document.getElementsByClassName("newtitlename")[0].childNodes[0].innerHTML

        //Dealing with the trends search bar that for some reason appears in the newtitlepretitle div
        const pretitleGet = new RegExp("The(.*)of");
        const newtitlepretitle = document.getElementsByClassName("newtitlepretitle")[0].textContent.match(pretitleGet)[0];
        console.log("The pretitle is: " + newtitlepretitle);

        const newtitlecategory = document.getElementsByClassName("newtitlecategory")[0].innerHTML;
        //console.log(document.getElementsByClassName("newflagbox")[0].childNodes[0])

        //Cases we need to handle
        //Uploaded flag
        //Not uploaded flag
        //With ripple
        //Without ripple
        //Random \n element
        //No random \n element

        var flagLink
        try{
            //Establish what case we're dealing with

            if(typeof document.getElementsByClassName("flagwithripple")[0] === "undefined"){
                //Flag ripple not present

                //Find out if there's a \n element present
                if(!document.getElementsByClassName("newflagbox")[0].childNodes[0].NodeType == 3){
                    //Case #1
                    console.log("Case #1")
                    try{flagLink = document.getElementsByClassName("newflagbox")[0].childNodes[0].childNodes[0].getAttribute("src").match(nationFlagLinkRegexUpload)[1];}catch{flagLink = document.getElementsByClassName("newflagbox")[0].childNodes[0].childNodes[0].getAttribute("src").match(nationFlagLinkRegexDefault)[1]; uploadBool = false}
                }
                else{
                    //Case #2
                    console.log("Case #2")
                    //console.log(document.getElementsByClassName("newflagbox")[0])
                    try{flagLink = document.getElementsByClassName("newflagbox")[0].childNodes[0].childNodes[0].getAttribute("src").match(nationFlagLinkRegexUpload)[1];}catch{flagLink = document.getElementsByClassName("newflagbox")[0].childNodes[1].childNodes[0].getAttribute("src").match(nationFlagLinkRegexDefault)[1]; uploadBool = false}
                }
            }
            else{
                //Flag ripple present
                //Again find out if there's a \n element present
                if(!document.getElementsByClassName("flagwithripple")[0].childNodes[0].NodeType == 3){
                    //Case #3
                    console.log("Case #3")
                    try{flagLink = document.getElementsByClassName("flagwithripple")[0].childNodes[1].getAttribute("src").match(nationFlagLinkRegexUpload)[1];}catch{flagLink = document.getElementsByClassName("flagwithripple")[0].childNodes[1].getAttribute("src").match(nationFlagLinkRegexDefault)[1]; uploadBool = false}
                }
                else{
                    //Case #4
                    console.log("Case #4")
                    try{flagLink = document.getElementsByClassName("flagwithripple")[0].childNodes[0].getAttribute("src").match(nationFlagLinkRegexUpload)[1];}catch{flagLink = document.getElementsByClassName("flagwithripple")[0].childNodes[0].getAttribute("src").match(nationFlagLinkRegexDefault)[1]; uploadBool = false}
                }
            }

        }
        catch(error){
        console.log("Attempt to get flag was unsuccessful: " + error)
        }

        if(flagLink.includes("uploads/")){
            flagLink = flagLink.replace("uploads/", "")
            uploadBool = true
        }
        console.log(flagLink);

        //Add button
        const contextArea = document.getElementsByClassName("nationnavbar fill-content")[0];
        const scriptActivationButton = document.createElement("a");
        const hrefLink = "/nation=" + nationViewedForURL + "/page=blank/econ_sectors/nnc=" + nationViewedWithCapitalization.replaceAll(" ", "_") + "/ntp=" + newtitlepretitle.replaceAll(" ", "_") + "/flagLink=" + flagLink.replace(".png", ".1").replace(".svg", ".2").replace(".gif", ".3") + "/dft=" + uploadBool +"/ntc=" + newtitlecategory.replaceAll(" ", "_") + "/generated_by:economic_iguana"
        scriptActivationButton.setAttribute("href", hrefLink)
        scriptActivationButton.setAttribute("class", "navbarlink-cards")
        scriptActivationButton.innerHTML = "<i class='navbaricon icon-chart-area'></i><span class='navtext'>Sectors</span>";
        contextArea.appendChild(scriptActivationButton);

        contextArea.style.display='none';
        contextArea.style.display='flex';

    }
    else{
        console.log("we're here!");

        //Get the information we want out of the URL
        const nationCapitalizedGetRegex = new RegExp("nnc=([^\/]+)");
        const nationNewTitlePretitleGetRegex = new RegExp("ntp=([^\/]+)");
        const nationalFlagGetRegex = new RegExp("flagLink=([^\/]+)");
        const newtitlecategoryGetRegex = new RegExp("ntc=([^\/]+)");
        const defaultFlagGetRegex = new RegExp("dft=([^\/]+)");

        const nationsFlag = currentURL.match(nationalFlagGetRegex)[1].replace(".1", ".png").replace(".2", ".svg").replace(".3", ".gif")
        const nationViewedWithCapitalization = currentURL.match(nationCapitalizedGetRegex)[1].replaceAll("_", " ");
        const nationNewTitlePretitle = decodeURI(currentURL.match(nationNewTitlePretitleGetRegex)[1].replaceAll("_", " "));
        const newtitleCategory = currentURL.match(newtitlecategoryGetRegex)[1].replaceAll("_", " ");

        const defaultFlagBool = currentURL.match(defaultFlagGetRegex)[1];
        let pathFlag = null
        console.log(defaultFlagBool)
        if(defaultFlagBool == "false"){
            pathFlag = "/images/flags/"
        }else{
            pathFlag = "/images/flags/uploads/"
        }
        //console.log(pathFlag)
        const newPage = document.getElementById("content");
        newPage.innerHTML = ("<div class='lineundercover'><div class='newflagcellbox'><div class='newflagbox'><a href='/nation=" + nationViewedForURL + "'><img src='" + pathFlag + nationsFlag + "'></a></div></div><div class='newnonflagstuff'><div class='newtitlebox'><div class='newtitlepretitle'>" + nationNewTitlePretitle + "</div><div class='newtitlename'><a href='/nation=" + nationViewedForURL +  "' class='quietlink mediumname'>" + nationViewedWithCapitalization + "</a></div><div class='newtitlecategory'>" + newtitleCategory + "</div></div></div></div>" + "<p class='nationnavbar fill-content' style='display: flex;'><a class='navbarlink-monument' href='/nation='" + nationViewedForURL + "><i class='navbaricon icon-monument'></i><span class='navtext'>Overview</span></a> <a class='navbarlink-news' href='/nation=" + nationViewedForURL + "'/detail=factbook/id=main'><i class='navbaricon icon-news'></i><span class='navtext'>Factbook</span></a><a class='navbarlink-newspaper' href='/page=dispatches/nation=" + nationViewedForURL + "'><i class='navbaricon icon-newspaper'></i><span class='navtext'>Dispatches</span></a><a class='navbarlink-balance-scale' href='nation=" + nationViewedForURL + "/detail=policies'><i class='navbaricon icon-balance-scale'></i><span class='navtext'>Policies</span></a><a class='navbarlink-male' href='nation=" + nationViewedForURL + "/detail=people'><i class='navbaricon icon-male'></i><span class='navtext'>People</span></a><a class='navbarlink-town-hall' href='nation=" + nationViewedForURL + "/detail=government'><i class='navbaricon icon-town-hall'></i><span class='navtext'>Government</span></a><a class='navbarlink-industrial-building' href='nation=" + nationViewedForURL + "/detail=economy'><i class='navbaricon icon-industrial-building'></i><span class='navtext'>Economy</span></a><a class='navbarlink-award' href='nation=" + nationViewedForURL + "/detail=rank'><i class='navbaricon icon-award'></i><span class='navtext'>Rank</span></a><a class='navbarlink-chart' href='nation=" + nationViewedForURL + "/detail=trend'><i class='navbaricon icon-chart'></i><span class='navtext'>Trend</span></a><a class='navbarlink-cards' href='page=deck/nation=" + nationViewedForURL + "'><i class='navbaricon icon-cards'></i><span class='navtext'>Cards</span></a><a class='navbarlink-industrial-building quietlink' id='hitlit'><i class='navbaricon icon-chart-area'></i><span class='navtext'>Sectors</span></a></p><style>#hitlit {color:black;}</style>")

        const chartAreaAddition = document.createElement("div");
        chartAreaAddition.setAttribute("id", 'chart-container');
        chartAreaAddition.setAttribute('style', "height:600px");
        newPage.appendChild(chartAreaAddition);

        //console.log(document.getElementById("chart-container"));

        produceTable(nationViewedWithCapitalization)
    }
    async function produceTable(nationViewedWithCapitalization){
        //Get all the industry and modifier data we need.
        // https://www.nationstates.net/cgi-bin/api.cgi?nation=testlandia;q=census;scale=16+10+12+18+24+11+22+25+13+21+20+14+23+19+15+70
        let industryInfo = await getIndustryData(nationViewedWithCapitalization, document.getElementById("loggedin").getAttribute("data-nname"))
        //console.log(industryInfo)

        //Industries
        const armsManufacturingGet = new RegExp("<SCALE id=\"16\">\n<SCORE>(.*)<\/SCORE>");
        const automobileManufacturingGet = new RegExp("<SCALE id=\"10\">\n<SCORE>(.*)<\/SCORE>");
        const basketWeavingGet = new RegExp("<SCALE id=\"12\">\n<SCORE>(.*)<\/SCORE>");
        const beverageSalesGet = new RegExp("<SCALE id=\"18\">\n<SCORE>(.*)<\/SCORE>");
        const bookPublishingGet = new RegExp("<SCALE id=\"24\">\n<SCORE>(.*)<\/SCORE>");
        const cheeseExportsGet = new RegExp("<SCALE id=\"11\">\n<SCORE>(.*)<\/SCORE>");
        const furnitureRestorationGet = new RegExp("<SCALE id=\"22\">\n<SCORE>(.*)<\/SCORE>");
        const gamblingGet = new RegExp("<SCALE id=\"25\">\n<SCORE>(.*)<\/SCORE>");
        const informationTechnologyGet = new RegExp("<SCALE id=\"13\">\n<SCORE>(.*)<\/SCORE>");
        const insuranceGet = new RegExp("<SCALE id=\"21\">\n<SCORE>(.*)<\/SCORE>");
        const miningGet = new RegExp("<SCALE id=\"20\">\n<SCORE>(.*)<\/SCORE>");
        const pizzaDeliveryGet = new RegExp("<SCALE id=\"14\">\n<SCORE>(.*)<\/SCORE>");
        const retailGet = new RegExp("<SCALE id=\"23\">\n<SCORE>(.*)<\/SCORE>");
        const timberWoodchippingGet = new RegExp("<SCALE id=\"19\">\n<SCORE>(.*)<\/SCORE>");
        const troutFishingGet = new RegExp("<SCALE id=\"15\">\n<SCORE>(.*)<\/SCORE>");
        const agricultureGet = new RegExp("<SCALE id=\"17\">\n<SCORE>(.*)<\/SCORE>");

        //Modifier stats
        const sciAdvGet = new RegExp("<SCALE id=\"70\">\n<SCORE>(.*)<\/SCORE>");

        let armsManufacturing = parseInt(industryInfo.match(armsManufacturingGet)[1])
        let automobileManufacturing	= parseInt(industryInfo.match(automobileManufacturingGet)[1])
        let basketWeaving = parseInt(industryInfo.match(basketWeavingGet)[1])
        let beverageSales = parseInt(industryInfo.match(beverageSalesGet)[1])
        let bookPublishing = parseInt(industryInfo.match(bookPublishingGet)[1])
        let cheeseExports = parseInt(industryInfo.match(cheeseExportsGet)[1])
        let furnitureRestoration = parseInt(industryInfo.match(furnitureRestorationGet)[1])
        let gambling = parseInt(industryInfo.match(gamblingGet)[1])
        let informationTechnology = parseInt(industryInfo.match(informationTechnologyGet)[1])
        let insurance = parseInt(industryInfo.match(insuranceGet)[1])
        let mining = parseInt(industryInfo.match(miningGet)[1])
        let pizzaDelivery = parseInt(industryInfo.match(pizzaDeliveryGet)[1])
        let retail = parseInt(industryInfo.match(retailGet)[1])
        let timberWoodchipping = parseInt(industryInfo.match(timberWoodchippingGet)[1])
        let troutFishing = parseInt(industryInfo.match(troutFishingGet)[1])
        let agriculture = parseInt(industryInfo.match(agricultureGet)[1])

        let sciAdv = parseInt(industryInfo.match(sciAdvGet)[1])

        let totalIndustrialOutput = (armsManufacturing + automobileManufacturing + basketWeaving + beverageSales + bookPublishing + cheeseExports + furnitureRestoration + gambling + informationTechnology + insurance + mining + pizzaDelivery + retail + timberWoodchipping + troutFishing + agriculture)
        //console.log(totalIndustrialOutput)

        let armsManufacturingPercentage = parseFloat(((armsManufacturing/totalIndustrialOutput)*100).toFixed(1));
        let automobileManufacturingPercentage = parseFloat(((automobileManufacturing / totalIndustrialOutput) * 100).toFixed(1));
        let basketWeavingPercentage = parseFloat(((basketWeaving / totalIndustrialOutput) * 100).toFixed(1));
        let beverageSalesPercentage = parseFloat(((beverageSales / totalIndustrialOutput) * 100).toFixed(1));
        let bookPublishingPercentage = parseFloat(((bookPublishing / totalIndustrialOutput) * 100).toFixed(1));
        let cheeseExportsPercentage = parseFloat(((cheeseExports / totalIndustrialOutput) * 100).toFixed(1));
        let furnitureRestorationPercentage = parseFloat(((furnitureRestoration / totalIndustrialOutput) * 100).toFixed(1));
        let gamblingPercentage = parseFloat(((gambling / totalIndustrialOutput) * 100).toFixed(1));
        let informationTechnologyPercentage = parseFloat(((informationTechnology / totalIndustrialOutput) * 100).toFixed(1));
        let insurancePercentage = parseFloat(((insurance / totalIndustrialOutput) * 100).toFixed(1));
        let miningPercentage = parseFloat(((mining / totalIndustrialOutput) * 100).toFixed(1))
        let pizzaDeliveryPercentage = parseFloat(((pizzaDelivery / totalIndustrialOutput) * 100).toFixed(1));
        let retailPercentage = parseFloat(((retail / totalIndustrialOutput) * 100).toFixed(1))
        let timberWoodchippingPercentage = parseFloat(((timberWoodchipping / totalIndustrialOutput) * 100).toFixed(1));
        let troutFishingPercentage = parseFloat(((troutFishing / totalIndustrialOutput) * 100).toFixed(1));
        let agriculturePercentage = parseFloat(((agriculture / totalIndustrialOutput) * 100).toFixed(1));

        //Chart images
        //So that we can change them based on different circumstances
        //These are the default images, so assuming a modern-tech standard nation
        let armsManufacturing_banner = "/images/banners/y108.jpg"
        let automobileManufacturing_banner	= "/images/banners/i51.jpg"
        let basketWeaving_banner = "/images/banners/i32.jpg"
        let beverageSales_banner = "/images/banners/i9.jpg"
        let bookPublishing_banner = "/images/banners/i17.jpg"
        let cheeseExports_banner = "/images/banners/i24.jpg"
        let furnitureRestoration_banner = "/images/banners/y2.jpg"
        let gambling_banner = "/images/banners/i29.jpg"
        let informationTechnology_banner = "/images/banners/z8.jpg"
        let insurance_banner = "/images/banners/y46.jpg"
        let mining_banner = "images/banners/i22.jpg"
        let pizzaDelivery_banner = "/images/banners/i40.jpg"
        let retail_banner = "/images/banners/y236.jpg"
        let timberWoodchipping_banner = "/images/banners/i30.jpg"
        let troutFishing_banner = "/images/banners/i23.jpg"
        let agriculture_banner = "/images/banners/y54.jpg"

        console.log(parseInt(sciAdv))
        console.log(sciAdv)
        if(parseInt(sciAdv) < 0){
            armsManufacturing_banner = "/images/banners/y320.jpg"
            automobileManufacturing_banner	= "/images/banners/y256.jpg"
            basketWeaving_banner = "/images/banners/i32.jpg"
            beverageSales_banner = "/images/banners/y219.jpg"
            bookPublishing_banner = "/images/banners/i17.jpg"
            cheeseExports_banner = "/images/banners/i24.jpg"
            furnitureRestoration_banner = "/images/banners/y68.jpg"
            gambling_banner = "/images/banners/i29.jpg"
            informationTechnology_banner = "/images/banners/z9.jpg"
            insurance_banner = "/images/banners/y46.jpg"
            mining_banner = "images/banners/d20.jpg"
            pizzaDelivery_banner = "/images/banners/i25.jpg"
            retail_banner = "/images/banners/t38.jpg"
            timberWoodchipping_banner = "/images/banners/y184.jpg"
            troutFishing_banner = "/images/banners/d5.jpg"
            agriculture_banner = "/images/banners/a3.jpg"
        }


        let testSeries = []

        function color(pattern){
            this.pattern = pattern;
            this.width = 1200;
            this.height = 300;
        }
        function industrialSector(name, pattern, y) {
            this.name = name;
            this.color = new color(pattern);
            this.y = y;
        }


        const sectorObj_armsManufacturing = new industrialSector('Arms Manufacturing', armsManufacturing_banner, armsManufacturingPercentage);
        const sectorObj_automobileManufacturing = new industrialSector('Automobile Manufacturing', automobileManufacturing_banner, automobileManufacturingPercentage);
        const sectorObj_basketWeaving = new industrialSector('Basket Weaving', basketWeaving_banner, basketWeavingPercentage);
        const sectorObj_beverageSales = new industrialSector('Beverage Sales', beverageSales_banner, beverageSalesPercentage);
        const sectorObj_bookPublishing = new industrialSector('Book Publishing', bookPublishing_banner, bookPublishingPercentage);
        const sectorObj_cheeseExports = new industrialSector('Cheese Exports', cheeseExports_banner, cheeseExportsPercentage);
        const sectorObj_furnitureRestoration = new industrialSector('Furniture Restoration', furnitureRestoration_banner, furnitureRestorationPercentage);
        const sectorObj_gambling = new industrialSector('Gambling', gambling_banner, gamblingPercentage);
        const sectorObj_informationTechnology = new industrialSector('Information Technology', informationTechnology_banner, informationTechnologyPercentage);
        const sectorObj_insurance = new industrialSector('Insurance', insurance_banner, insurancePercentage);
        const sectorObj_mining = new industrialSector('Mining', mining_banner, miningPercentage);
        const sectorObj_pizzaDelivery = new industrialSector('Pizza Delivery', pizzaDelivery_banner, pizzaDeliveryPercentage);
        const sectorObj_retail = new industrialSector('Retail', retail_banner, retailPercentage);
        const sectorObj_timberWoodchipping = new industrialSector('Timber Woodchipping', timberWoodchipping_banner, timberWoodchippingPercentage);
        const sectorObj_troutFishing = new industrialSector('Trout Fishing', troutFishing_banner, troutFishingPercentage);
        const sectorObj_agriculture = new industrialSector('Agriculture', agriculture_banner, agriculturePercentage);

        if(armsManufacturingPercentage > 0){
            testSeries.push(JSON.parse(JSON.stringify(sectorObj_armsManufacturing)));
        }

        if(automobileManufacturingPercentage > 0){
            testSeries.push(JSON.parse(JSON.stringify(sectorObj_automobileManufacturing)));
        }


        if(basketWeavingPercentage > 0){
            testSeries.push(JSON.parse(JSON.stringify(sectorObj_basketWeaving)));
        }

        if(beverageSalesPercentage > 0){
            testSeries.push(JSON.parse(JSON.stringify(sectorObj_beverageSales)));
        }

        if(bookPublishingPercentage > 0){
            testSeries.push(JSON.parse(JSON.stringify(sectorObj_bookPublishing)));
        }

        if(cheeseExportsPercentage > 0){
            testSeries.push(JSON.parse(JSON.stringify(sectorObj_cheeseExports)));
        }

        if(furnitureRestorationPercentage > 0){
            testSeries.push(JSON.parse(JSON.stringify(sectorObj_furnitureRestoration)));
        }

        if(gamblingPercentage > 0){
            testSeries.push(JSON.parse(JSON.stringify(sectorObj_gambling)));
        }

        if(informationTechnologyPercentage > 0){
            testSeries.push(JSON.parse(JSON.stringify(sectorObj_informationTechnology)));
        }

        if(insurancePercentage > 0){
            testSeries.push(JSON.parse(JSON.stringify(sectorObj_insurance)));
        }

        if(miningPercentage > 0){
            testSeries.push(JSON.parse(JSON.stringify(sectorObj_mining)));
        }

        if(pizzaDeliveryPercentage > 0){
            testSeries.push(JSON.parse(JSON.stringify(sectorObj_pizzaDelivery)));
        }

        if(retailPercentage > 0){
            testSeries.push(JSON.parse(JSON.stringify(sectorObj_retail)));
        }

        if(timberWoodchippingPercentage > 0){
            testSeries.push(JSON.parse(JSON.stringify(sectorObj_timberWoodchipping)));
        }

        if(troutFishingPercentage > 0){
            testSeries.push(JSON.parse(JSON.stringify(sectorObj_troutFishing)));
        }

        if(agriculturePercentage > 0){
            testSeries.push(JSON.parse(JSON.stringify(sectorObj_agriculture)));
        }

        //console.log(testSeries);
        const chartText = "Total industrial output: <b>"+ totalIndustrialOutput.toLocaleString() + " production units</b>";

        loadScript('https://www.nationstates.net/highcharts_v1421386524.js', function() {
            console.log('Highcharts loaded');
            var chart = new Highcharts.Chart({chart: {renderTo: 'chart-container', backgroundColor:'rgba(255, 255, 255, 0.1)', plotBackgroundColor: null, plotBorderWidth: null, plotShadow: false},title: {style: {color: '#444444'},margin:22,useHTML:true,text: ("The Economic Sectors of " + nationViewedWithCapitalization)},subtitle: {style: {color: '#444'},text: chartText,useHTML: true,},credits: {enabled: false},tooltip: {formatter: function() {return '<b>'+ this.point.name +'</b>: '+ this.y +' %';}},plotOptions: {pie: {allowPointSelect: true,cursor: 'pointer',dataLabels: {enabled: true,connectorColor:'#999',formatter: function() {return '<b>'+ this.point.name +'</b>: '+ this.y +' %';}}}},series: [{type: 'pie',name: 'Government',data: testSeries}]});
            //var chart = new Highcharts.Chart({chart: {renderTo: 'chart-container', backgroundColor:'rgba(255, 255, 255, 0.1)', plotBackgroundColor: null, plotBorderWidth: null, plotShadow: false},title: {style: {color: '#444444'},margin:22,useHTML:true,text: ("The Economic Sectors of " + nationViewedWithCapitalization)},subtitle: {style: {color: '#444'},text: "This text is here as a placeholder",useHTML: true,},credits: {enabled: false},tooltip: {formatter: function() {return '<b>'+ this.point.name +'</b>: '+ this.y +' %';}},plotOptions: {pie: {allowPointSelect: true,cursor: 'pointer',dataLabels: {enabled: true,connectorColor:'#999',formatter: function() {return '<b>'+ this.point.name +'</b>: '+ this.y +' %';}}}},series: [{type: 'pie',name: 'Government',data: [ { name:'Arms Manufacturing', y:armsManufacturingPercentage, color: { pattern: armsManufacturing_banner, width:1200, height:300 } } ,  { name:'Automobile Manufacturing', y:automobileManufacturingPercentage, color: { pattern: automobileManufacturing_banner, width:1200, height:300 } } , { name:'Basket Weaving', y:basketWeavingPercentage, color: { pattern: basketWeaving_banner, width:1200, height:300 } }, { name:'Beverage Sales', y:beverageSalesPercentage, color: { pattern: beverageSales_banner, width:1200, height:300 } }, { name:'Book Publishing', y:bookPublishingPercentage, color: { pattern: bookPublishing_banner, width:1200, height:300 } }, { name:'Cheese Exports', y:cheeseExportsPercentage, color: { pattern: cheeseExports_banner, width:1200, height:300 } }, { name:'Furniture Restoration', y:furnitureRestorationPercentage, color: { pattern: furnitureRestoration_banner, width:1200, height:300 } }, { name:'Gambling', y:gamblingPercentage, color: { pattern: gambling_banner, width:1200, height:300 } }, { name:'Information Technology', y:informationTechnologyPercentage, color: { pattern: informationTechnology_banner, width:1200, height:300 } }, { name:'Insurance', y:insurancePercentage, color: { pattern: insurance_banner, width:1200, height:300 } }, { name:'Mining', y:miningPercentage, color: { pattern: mining_banner, width:1200, height:300 } }, { name:'Pizza Delivery', y:pizzaDeliveryPercentage, color: { pattern: pizzaDelivery_banner, width:1200, height:300 } }, { name:'Retail', y:retailPercentage, color: { pattern: retail_banner, width:1200, height:300 } }]}]});
        });

        console.log("done!")
    }

    //API stuff
    async function getIndustryData(nationName, username) {
            const url = "https://www.nationstates.net/cgi-bin/api.cgi?nation=" + nationName.replaceAll(" ", "_") + ";q=census;scale=16+10+12+18+24+11+22+25+13+21+20+14+23+19+15+17+70" + "&script=Economic_Iguana_v1.0_developedBy_Mechanocracy_andusedBy_" + username;
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }

                const apiResponse = await response.text();
                //console.log(apiResponse);
                return apiResponse
            } catch (error) {
                console.error(error.message);
            }
        }
})();