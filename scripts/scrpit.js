// alert('Connected');


const btnContainer = document.getElementById('btn-container')
// 
const cardContainer = document.getElementById('card-container')
const sortBtn = document.getElementById('sort-btn')

let selectedCategories = 1000;
let sortByView = false;

sortBtn.addEventListener('click', ()=>{
    sortByView = true;
    fetchDataCategories(selectedCategories,sortByView)
})

// Fetching data for nav Bar
const fetchCategories = async () => {
    const res = await fetch(`https://openapi.programming-hero.com/api/videos/categories`);
    const data = await res.json();
    const buttons = data.data;
    displayNav(buttons);
}
const displayNav = (buttons) => {
    buttons.forEach(button => {
        const btnCategory = document.createElement('button');
        btnCategory.className = 'btn-category border border-zinc-500 rounded-xl py-3 px-8 text-xl font-semibold';
        btnCategory.innerText = button.category
        btnCategory.addEventListener('click', () =>{
            fetchDataCategories(button.category_id)
            const allBtn = document.querySelectorAll('.btn-category')
            for (const btn of allBtn){
                btn.classList.remove('bg-red-600')
            }
            btnCategory.classList.add('bg-red-600')
        } )
        btnContainer.appendChild(btnCategory)
        // Proti ta button set korar jonne looping hobe bar bar so ekhane templete string use kora na kora aka e kotha
    });
}
// For Connecting the Buttons With the data
const fetchDataCategories = async (categoryID, sortByView) => {
    // console.log(`${categoryID}`)
    selectedCategories = categoryID;
    // Fetching data for cards
    const res = await fetch(`https://openapi.programming-hero.com/api/videos/category/${categoryID}`);
    const data = await res.json();
    const cards = data.data;
    if(sortByView){
        cards.sort((a,b) => {
            const totalViewStrFirst = a.others?.views
            const totalViewStrSecond = b.others?.views
            const totalViewFirstNum =parseFloat(totalViewStrFirst.replace("k", ''))||0;
            const totalViewSecondNum =parseFloat(totalViewStrSecond.replace("k", ''))||0;
            return  totalViewSecondNum - totalViewFirstNum;
        })
    }
    // console.log(cards)
    const errorDiv = document.getElementById('error-element')
    if(cards.length === 0){
        errorDiv.classList.remove('hidden')
    }
    else{
        errorDiv.classList.add('hidden')
    }
    displayCards(cards);
}

const displayCards = (cards) => {
    cardContainer.innerHTML ='';
    cards.forEach(card => {
        // console.log(card)
        const containerDiv = document.createElement('div')
        containerDiv.className ='bg-base-100 shadow-xl p-4 rounded-xl';
        let verifiedBadge = '';
        if(card.authors[0].verified){
        verifiedBadge = `<i class="fa-solid fa-certificate text-blue-600"></i>`
        }
        let viewHours = '';
if (card.others?.posted_date) {
    const viewsInMs = parseInt(card.others.posted_date); // Convert string to integer
    
    // Convert milliseconds to seconds
    const totalSeconds = viewsInMs / 1000;

    // Calculate hours
    const hours = Math.floor(totalSeconds / 3600);
    
    // Calculate remaining seconds after calculating the hours
    const remainingSecondsAfterHours = totalSeconds % 3600;

    // Calculate minutes
    const minutes = Math.floor(remainingSecondsAfterHours / 60);

    // Calculate remaining seconds after calculating the minutes
    const seconds = Math.floor(remainingSecondsAfterHours % 60);

    console.log(`${hours} hours, ${minutes} minutes, ${seconds} seconds`);

    // Assuming viewHours is an HTML element
    viewHours = `<p class="text-sm font-bold text-black p-1" id="">${hours} h, ${minutes} m, ${seconds} s</p>`;
}

        
        
        containerDiv.innerHTML =`
        <div>
        <figure class="object-cover"><img class ="h-[200px] w-[300px] rounded-xl" src="${card.thumbnail}" alt="Shoes" /></figure>
        <div class="-translate-y-10 translate-x-40 w-[120px] rounded-lg shadow-lg bg-slate-300">
            ${viewHours}
        </div>
    </div>
    <div class="card-body p-3">
        <div class="flex justify-around space-x-3">
            <img class="w-[60px] h-[60px] rounded-full" src="${card.authors[0].profile_picture}" alt="">
            <div>
                <h2 class="text-lg font-bold" id="" class="card-title">${card.title}</h2>
                <p id="" class="text-sm">${card.authors[0].profile_name} <span class="text-lg"> ${verifiedBadge} </i></span></p>
                <p class="text-sm" id="">${card.others?.views}</p>
            </div>

        </div>
    </div>`
    cardContainer.appendChild(containerDiv)
    });
}

fetchCategories();
fetchDataCategories(selectedCategories,sortByView)