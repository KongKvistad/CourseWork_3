
// ################################################################
// ###                 code for products page                   ###
// ################################################################

let list = document.getElementById("icecream-list");

// function declaration for list items

function genList (arr){

    for(let i = 0; i < arr.length; i++){
        
        // declaring the html elements
        let name = document.createElement('dt');
        let description = document.createElement('dd');
        let price = document.createElement('dd');

        // declaring the textnodes
        let nameNode = document.createTextNode(arr[i].name);

        let descNode = document.createTextNode(arr[i].description);

        let priceNode = document.createTextNode(arr[i].price +  ' NOK');

        // appending nodes to html elements
        name.appendChild(nameNode);

        description.appendChild(descNode);

        price.appendChild(priceNode);

        // structuring the DD tags to be children of DT
        name.appendChild(description);
        name.appendChild(price);


        // making the DL-tag the parent of everything
        list.appendChild(name);

        list.style.backgroundColor = 'white';
        list.style.boxShadow = '7px 8px 20px 0px #00000057'
    };
};



// logic for determining what list to generate.
// The apropriate sub-array gets passed inn as a string client-side -> the script then matches it here.

// also saves those parameters in "slctBtn" for later use
let slctBtn = [];

function reveal (arg, id){
    if (list.innerHTML === '') {
        genList(iceCreams[arg]);
        slctBtn.push(arg, id);

    } else {
        list.innerHTML = '';
        genList(iceCreams[arg]);
        slctBtn = [];
        slctBtn.push(arg, id);
    }
}

// separate sorting methods depending on the data type. 
// For strings i've used a method called localCompare, for numbers it's a 
// generic comparator function. These serve as callbacks to the .sort method.

newList = [];


function runSort (vals){
    if (vals === "name" || vals === "description") {
        newList = [];
        function sorting(props) {
            return function (a,b) {
                return a[props].localeCompare(b[props]);
            
            };
        };
    newList.push(iceCreams[slctBtn[0]].sort(sorting(vals)));

    } else if (vals === "price") {
        newList = [];
        newList.push(iceCreams[slctBtn[0]].sort(function(a, b) {
            return a.price - b.price;
        }));
    }
    
    list.innerHTML = "";
    genList(newList[0]);
};





// ################################################################
// ###                 code for reservations page               ###
// ################################################################


// - keep user from picking a time without picking a date
function inform (){
    if (document.getElementById("dayPicker").value == 0) {
        alert("You have to pick a day first!");
        document.getElementById("timepickerFrom").value = "";
        document.getElementById("timepickerTo").value = "";
    };
}

function evalOpeningHours() {
    // - determine what time options to display with respects to the day's opening hours
    document.getElementById("timepickerFrom").value = "";
    document.getElementById("timepickerTo").value = "";
    let selectedDay = document.getElementById("dayPicker").value;
    if (selectedDay >= 1 && selectedDay <= 4) {
        document.getElementById("timepickerFrom").max = "20:00";
        document.getElementById("timepickerTo").max = "20:00";
    } else if (selectedDay == 5 || selectedDay == 7 ){
        document.getElementById("timepickerFrom").max = "21:30";
        document.getElementById("timepickerTo").max = "21:30";
    } else {
        document.getElementById("timepickerFrom").max = "22:00";
        document.getElementById("timepickerTo").max = "22:00";
    };
    const current = new Date();

    // - Keep user from making submissions for past weekdays
    if (current.getDay() > selectedDay) {
        alert("Ohoy, time traveler! you cannot book past dates!")
        document.getElementById("dayPicker").options[0].selected = 'selected';
    };

};


// ################################################################
// ###         The constructor function below is                ###
// ###         outside the scope of the assignment. It deals    ###
// ###         with logging and visualizing the submission.     ###
// ###         scroll past to see further form validations.     ###
// ################################################################
    let peoplelist = [];

    //contructor function to make submissions into objects. 
    function Submission(first, last, date, timeFrom, timeTo, adults, children, infants, email, phone, comment) {
        this.firstName = first;
        this.lastName = last;
        this.day = date;
        this.timeFrom = timeFrom;
        this.timeTo = timeTo;
        this.adults = adults;
        this.children = children;
        this.infants = infants;
        this.email = email;
        this.phone = phone;
        this.comment = comment;
        this.visualize = function () {
            
            let div = document.createElement("div");
            let wrapper = document.getElementsByClassName('timetable')[0];

            wrapper.appendChild(div);

            //  make date calculable and visualize 
            let dateConv = parseInt(date, 10) + 1;
            let dateCalc = dateConv +' / '+ (dateConv + 1);

            div.style.gridColumn = dateCalc.toString()
            
            // Hour + minute calculation and visualization. 
            // Note that military time is 8 hours ahead of our schema.
            let interA = timeFrom.split(':');
            let interB = timeTo.split(':');            

            let interA_hour = parseInt(interA[0]);
            let interB_hour = parseInt(interB[0]);

            let interA_min = parseInt(interA[1]);
            let interB_min = parseInt(interB[1]);

            let hourinterval = interB_hour - interA_hour;

            let mininterval = interB_min - interA_min;
            
            // This part is hell. I highly suggest you skip it unless you're absolutely interested.
            if (interA_min === 0 && interB_min === 0 ) {
                console.log('case1')
                div.style.gridRow = (interA_hour - 8).toString() + ' / span ' + hourinterval
                div.style.backgroundColor = '#A10416';
                div.style.borderRadius = '10px';
            
            } else if (interA_min === 0 && interB_min > 0) {
                console.log('case2')
                div.style.gridRow = (interA_hour - 8).toString() + ' / span ' + hourinterval
                div.style.backgroundColor = '#A10416';
                div.style.borderTopLeftRadius = '10px';
                div.style.borderTopRightRadius = '10px';

                let div2 = document.createElement("div");
                wrapper.appendChild(div2);
                div2.style.display = "flex";
                div2.style.backgroundColor = '#A10416';
                div2.style.gridColumn = dateCalc.toString()
                div2.style.gridRow = (interB_hour - 8).toString() +" / "+ (interB_hour - 7).toString();
                div2.style.height = (interB_min / 60 * 100) + "%";
                div2.style.borderBottomLeftRadius = '10px';
                div2.style.borderBottomRightRadius = '10px';
            
            } else if (interA_min > 0 && interB_min === 0) {
                console.log('case3')
                div.style.gridRow = (interA_hour - 7).toString() + ' / span ' + (hourinterval - 1);
                div.style.backgroundColor = '#A10416';
                div.style.borderBottomLeftRadius = '10px';
                div.style.borderBottomRightRadius = '10px';

                let div2 = document.createElement("div");
                wrapper.appendChild(div2);
                div2.style.display = "flex";
                div2.style.backgroundColor = '#A10416';
                div2.style.gridColumn = dateCalc.toString()
                div2.style.gridRow = (interA_hour - 8).toString() +" / "+ (interA_hour - 7).toString();
                div2.style.height = 100 - (interA_min / 60 * 100) + "%";
                div2.style.alignSelf = 'flex-end';
                div2.style.borderTopLeftRadius = '10px';
                div2.style.borderTopRightRadius = '10px';

            } else if(interB_hour === interA_hour + 1 && interA_min === interB_min || interB_hour === interA_hour + 1 && interA_min < interB_min) {
                console.log('case4')
                let div2 = document.createElement("div");
                wrapper.appendChild(div2);
                div2.style.display = "flex";
                div2.style.backgroundColor = '#A10416';
                div2.style.gridColumn = dateCalc.toString()
                div2.style.gridRow = (interB_hour - 8).toString() +" / "+ (interB_hour - 7).toString();
                div2.style.height = (interB_min / 60 * 100) + "%";
                div2.style.borderBottomLeftRadius = '10px';
                div2.style.borderBottomRightRadius = '10px';

                let div3 = document.createElement("div");
                wrapper.appendChild(div3);
                div3.style.display = "flex";
                div3.style.backgroundColor = '#A10416';
                div3.style.gridColumn = dateCalc.toString()
                div3.style.gridRow = (interA_hour - 8).toString() +" / "+ (interA_hour - 7).toString();
                div3.style.height = 100 - (interA_min / 60 * 100) + "%";
                div3.style.alignSelf = 'flex-end';
                div3.style.borderTopLeftRadius = '10px';
                div3.style.borderTopRightRadius = '10px';

            } else if(interB_hour >= interA_hour + 2 && interA_min === interB_min || interA_min < interB_min) {
                console.log('case5')
                div.style.gridRow = (interA_hour - 7).toString() + ' / span ' + (hourinterval - 1);
                div.style.backgroundColor = '#A10416';
                let div2 = document.createElement("div");
                wrapper.appendChild(div2);
                div2.style.display = "flex";
                div2.style.backgroundColor = '#A10416';
                div2.style.gridColumn = dateCalc.toString()
                div2.style.gridRow = (interB_hour - 8).toString() +" / "+ (interB_hour - 7).toString();
                div2.style.height = (interB_min / 60 * 100) + "%";
                div2.style.borderBottomLeftRadius = '10px';
                div2.style.borderBottomRightRadius = '10px';

                let div3 = document.createElement("div");
                wrapper.appendChild(div3);
                div3.style.display = "flex";
                div3.style.backgroundColor = '#A10416';
                div3.style.gridColumn = dateCalc.toString()
                div3.style.gridRow = (interA_hour - 8).toString() +" / "+ (interA_hour - 7).toString();
                div3.style.height = 100 - (interA_min / 60 * 100) + "%";
                div3.style.alignSelf = 'flex-end';
                div3.style.borderTopLeftRadius = '10px';
                div3.style.borderTopRightRadius = '10px';
            
            
            } else if (interA_min > 0 && interB_min > 0) {
                console.log('case6')
                div.style.gridRow = (interA_hour - 7).toString() + ' / span ' + (hourinterval - 1);
                div.style.backgroundColor = '#A10416';

                let div2 = document.createElement("div");
                wrapper.appendChild(div2);
                div2.style.display = "flex";
                div2.style.backgroundColor = '#A10416';
                div2.style.gridColumn = dateCalc.toString()
                div2.style.gridRow = (interB_hour - 8).toString() +" / "+ (interB_hour - 7).toString();
                div2.style.height = (interB_min / 60 * 100) + "%";
                div2.style.borderBottomLeftRadius = '10px';
                div2.style.borderBottomRightRadius = '10px';

                let div3 = document.createElement("div");
                wrapper.appendChild(div3);
                div3.style.display = "flex";
                div3.style.backgroundColor = '#A10416';
                div3.style.gridColumn = dateCalc.toString()
                div3.style.gridRow = (interA_hour - 8).toString() +" / "+ (interA_hour - 7).toString();
                div3.style.height = 100 - (interA_min / 60 * 100) + "%";
                div3.style.alignSelf = 'flex-end';
                div3.style.borderTopLeftRadius = '10px';
                div3.style.borderTopRightRadius = '10px';
            }
            alert(`Thank you ${first} ${last} ! We confirm your booking from ${timeFrom} to ${timeTo}!`)

        };
    };

// ################################################################
// ###        further validations for reservations page         ###
// ################################################################

    let formselect = document.getElementById('resForm');
    formselect.onsubmit = makeRes;
    
    function makeRes (params) {
        // stops the default submit event from firing.
        params.preventDefault();

        // variables for validation
        let hourChk_A = parseInt(document.getElementsByName("timeFrom")[0].value.split(":")[0]);
        let hourChk_B = parseInt(document.getElementsByName("timeTo")[0].value.split(":")[0]);
        let minChk_A = parseInt(document.getElementsByName("timeFrom")[0].value.split(":")[1]);
        let minChk_B = parseInt(document.getElementsByName("timeTo")[0].value.split(":")[1]);

        //Keep visualization from overlapping, keep user form booking for past dates,
        //keep user from booking for below 1 hour, etc.
        if (peoplelist.length >= 1) {
            alert("Make a new reservation?");
            window.location.reload();
        } else if (hourChk_A === hourChk_B) {
            alert("you have to at least book for an hour!");
            return false
        } else if (hourChk_A > hourChk_B) {
            alert("Time is linear. AND it moves forward. Ya dummy.")
            return false
        } else if (hourChk_B === hourChk_A + 1 && minChk_B < minChk_A) {
            alert("you have to at least book for an hour!");
            return false
        } else {

            // creates a new object, pushes it into an array for confirmation purpooses
        //first, last, date, timeFrom, timeTo, adults, children, infants, email, phone, comment
        let reservation = new Submission(document.getElementsByName("fname")[0].value,
                                document.getElementsByName("lname")[0].value,
                                document.getElementsByName("date")[0].value,
                                document.getElementsByName("timeFrom")[0].value,
                                document.getElementsByName("timeTo")[0].value,
                                document.getElementsByName("adult")[0].value,
                                document.getElementsByName("child")[0].value,
                                document.getElementsByName("infant")[0].value,
                                document.getElementsByName("email")[0].value,
                                document.getElementsByName("phone")[0].value,
                                document.getElementsByName("comment")[0].value,);
        reservation.visualize();
        peoplelist.push(reservation);
        }
    };