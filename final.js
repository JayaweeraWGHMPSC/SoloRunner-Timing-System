import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDPwA_y2ZVycvIoek0bmrobve6BT1G-FZ0",
    authDomain: "l1project-681ca.firebaseapp.com",
    databaseURL: "https://l1project-681ca-default-rtdb.firebaseio.com",
    projectId: "l1project-681ca",
    storageBucket: "l1project-681ca.appspot.com",
    messagingSenderId: "43200809626",
    appId: "1:43200809626:web:65dc0ffabaf58a868eed23"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function addRowToTable(index,date, stime, etime, timing, rtime, svideo) {
    let trow = document.createElement("tr");
    trow.id = `row-${index}`;
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    let td3 = document.createElement('td');
    let td4 = document.createElement('td');
    let td5 = document.createElement('td');
    let td6 = document.createElement('td');

    td1.innerHTML = date || '<span style="color:red;">Not Completed</span>';
    td2.innerHTML = stime || '<span style="color:red;">Not Completed</span>';
    td3.innerHTML = etime || '<span style="color:red;">Not Completed</span>';
    td4.innerHTML = timing || '<span style="color:red;">Not Completed</span>';
    td5.innerHTML = rtime || '<span style="color:red;">Not Completed</span>';

    let a1 = document.createElement('a');
    if (svideo) {
        a1.href = svideo;
        a1.innerHTML = 'Start Action';
        a1.target = '_blank';
    } else {
        a1.innerHTML = '<button style="color:white; border: none; background-color: blue; width: 80px; height: 30px; border-radius: 17px;"><a>Click Here</a></button>';
    }

    td6.appendChild(a1);

     td6.addEventListener('click', () => {
        window.location.href = `imageDisplay.html?id=${index}`;
    });

    trow.appendChild(td1);
    trow.appendChild(td2);
    trow.appendChild(td3);
    trow.appendChild(td4);
    trow.appendChild(td5);
    trow.appendChild(td6);

    document.getElementById('tbody1').appendChild(trow);
}

function addItemsToTable(students) {
    const tbody = document.getElementById('tbody1');
    tbody.innerHTML = "";

    // Check if there are more than one student
    if (students.length > 1) {
        // Remove the last student before adding rows to the table
        students.pop();
        students.pop();
    }

    students.forEach((element, index) => {
        console.log(index);
        addRowToTable(
            index,
            element.Date, 
            element.Starttime, 
            element.Rtime, 
            element.EndTime, 
            element.Timing,  
            element.starting
        );
    });

}

function GetAllDataRealtime() {
    const dbRef = ref(db, `runner`);
    onValue(dbRef, (snapshot) => {
        var students = [];
        //console.log(students);
        snapshot.forEach(childSnapshot => {
            students.push(childSnapshot.val());
        });
        addItemsToTable(students);
    }, {
        onlyOnce: false
    });
}

window.onload = GetAllDataRealtime;
