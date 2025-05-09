function quoteJS() {
    fetch("https://zenquotes.io/api/quotes/")
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const rand = Math.floor(Math.random()*data.length);
        const q = data[rand];
        document.getElementById("quoteContent").textContent = `"${q.q}" - ${q.a}`;
    })
}

function vopc(){
    if (annyang) {
      const commands = {
        'hello': () => { alert('Hello world!'); },
        'Navigate to *page': (page) => {
          console.log(page)
          window.location.href = `${page}.html`;
        },
        'Change the Color to *color': (color) => {
          console.log(color)
          document.body.style.backgroundColor = color;
        },
        'Look up *stock': (stock) => {
          const nt = stock.toUpperCase();
          document.getElementById("tLook").value = nt;
          console.log(nt)
          document.getElementById("stkBtn").click()
        
        },
        'Load Dog Breed *breed': (breed) => {
          console.log(breed)
          populateDiv(breed)
        }
      };
  
      annyang.addCommands(commands);
    
      annyang.start();
  
      console.log("started")
    }
  }
    
  function start(){
    if (annyang){
      vopc();
      annyang.start();
      console.log("start again")
    }
  }
  
  function stop(){
    if(annyang){
      annyang.abort();
      console.log("stopped")
    }
  }

function chartFunc(){
    var c;
    document.getElementById("stockForm").addEventListener("submit", async function(event) {
        event.preventDefault();
        const ctx =document.getElementById('myChart');

        const{prices, time} = await tickData();;
        const tflat = time.flat()
        const pflat = prices.flat()
        console.log(prices)
        console.log(time)
        c= new Chart(ctx, {
            type: 'line',
            data: {
                labels: tflat,
                datasets: [{
                    label: '$ Stock Price',
                    data: pflat,
                    fill: false,
                    tension: 0.4
                }]
            }
        })
    })
}

async function tickData(){
    const currentTime=Math.floor(Date.now() /1000);
    const subTime1 = document.getElementById("tSelect").value;
    console.log(typeof subTime1)

    let stock=document.getElementById("tLook").value.toUpperCase();
    const convertedCurrent = new Date(currentTime * 1000);

    const previous = new Date();
    previous.setDate(previous.getDate() - subTime1)

    const tConvertedCurrent = (convertedCurrent.toISOString().split("T")[0]);
    const tConvertedPrevious = (previous.toISOString().split("T")[0]);
  
    console.log(tConvertedPrevious)
    let pr = [];
    let t = [];
    console.log("here")
    await fetch(`https://api.polygon.io/v2/aggs/ticker/${stock}/range/1/day/${tConvertedPrevious}/${tConvertedCurrent}?
    adjusted=true&sort=asc&limit=120&apiKey=UAYL9gaZGXkxFEiC5zz99usp4tAElXwl`)
    .then(response => response.json()).then(data => {
        console.log("here too")
        pr.push(data.results.map(st => st.c))

        t.push( data.results.map(t=> new Date(t.t).toISOString().split("T")[0]))
        console.log(pr)
        console.log(t)
    })
    console.log("placed here x3")
    console.log(pr)
    console.log(t)
    return {prices:pr, time:t}
}

async function redditStock(){
    return fetch (`https://tradestie.com/api/v1/apps/reddit?date=2022-04-03`)
    .then(response => response.json())
    .then(data => {
        let r = data.slice(0, 5)
        return r
    })
    
  }

  async function populateReddit(){
    document.getElementById("stkTable");
    const apiResponse = await redditStock();
    const result = await apiResponse;
  
    result.forEach(stock =>{
        const row = document.createElement('tr');
        const tick = document.createElement('td');
        const comments = document.createElement('td');
        const sentiment = document.createElement('td');
        
  
        comments.innerHTML = stock.no_of_comments;
        tick.innerHTML = stock.ticker;
        const url = document.createElement('a');
        url.href = `https://finance.yahoo.com/quote/${tick.innerHTML}/`
        url.textContent = tick.innerHTML;
        
        row.append(url);
        row.append(comments);
  
        const bull = document.createElement("img")
        const bear = document.createElement("img")
        console.log("here1")
  
        bull.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYdvKCEdnL5xgIha_M5YNFaid4lVV-kxBfjVZRlVhP7evhzI1FKcd_m7YoDD3sAU2sH68&usqp=CAU"
        bear.src = "https://cdn.corporatefinanceinstitute.com/assets/bear-market.jpeg"
        bear.width = 200;
        bull.width = 200;

        if(sentiment.innerHTML === "Bull"){
            row.appendChild(bull);
            console.log("here")
          }else{
            row.appendChild(bear);
          }
          stkTable.append(row);
      })
    }

async function dogImage() {
    let f = "";
    return fetch(`https://dog.ceo/api/breeds/image/random`)
    .then(response => response.json())
    .then(data => {
        f= data.message;
        return f
    })


}

async function populateDog() {
    document.getElementById("dogSlide");
    for(i=0; i < 10; i++){
        const apiResponse = await dogImage();
        const result = apiResponse;
        let c = document.getElementById(`pic${i}`)
        c.src = result;
        console.log(c.src)
        c.width = 500;
        c.height = 500;
        dogSlide.appendChild(c)
    }
}

async function dogInfo() {
    return fetch("https://dogapi.dog/api/v2/breeds")
    .then(r => r.json())
    .then(d => {
        console.log(d.data)
        return d.data
    })
}

async function popButton() {
    document.getElementById("info");
    const apiResponse = await dogInfo();
    const result = await apiResponse;
    console.log(result[0].attributes)
    
    for (i = 0; i<10; i++){
        const b = document.createElement("button")
        b.textContent = result[i].attributes.name;
        b.className = "button-33"
        b.setAttribute("textContent", result[i].attributes.name)
        console.log(b.textContent)
        console.log()

        b.addEventListener("click", function (){
            populateDiv(b.textContent);
        });

        dogbtns.append(b)
    }
}

async function populateDiv(name){
    const apiResponse = await dogInfo();
    const result = await apiResponse;
    document.getElementById("info");
    const d = document.createElement("div")
    d.style.border = "solid black 2px";
    d.style.backgroundColor = "white";
    info.innerHTML = "";

    result.forEach(breed => {
        if(breed.attributes.name === name){
         
          d.innerHTML = `
          <h2>Name: ${breed.attributes.name}</h2>
          <h3> Description: ${breed.attributes.description}
          <h3> Min Life: ${breed.attributes.life.min} <h3>
          <h3> Max Life: ${breed.attributes.life.max} <h3>
          `
          info.append(d)
        }
      })
    }

    async function dogFunc() {
        await popButton();
        await simpleslider.getSlider();
        await populateDog();
      }