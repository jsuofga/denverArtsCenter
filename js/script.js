
    const rxURL = 'http://172.31.3.'
    var tvSelected = '1';
    var inputSelected = '1';
    var snapShotCounterTX = 0;
    var snapShotCounterRX = 0;
    
    var txCapture = '0';
    var rxCapture = '0';

    let page1 = document.getElementById('page1');
    let page2 = document.getElementById('page2');

    let TVonBtn = document.getElementById('TVonBtn');
    let TVoffBtn = document.getElementById('TVoffBtn');
    let SwitchBtn = document.getElementById('SwitchBtn');
    let SnapShotsBtn = document.getElementById('SnapShotsBtn');


    let page1Btn1 = document.getElementById('page1Btn1');
    let page1Btn2 = document.getElementById('page1Btn2');
    let page1Btn3 = document.getElementById('page1Btn3');
    let page1Btn4 = document.getElementById('page1Btn4');
    let page1Btn5 = document.getElementById('page1Btn5');
    let page1Btn6 = document.getElementById('page1Btn6');

    let tv1Input = document.getElementById('tv1Input');
    let tv2Input = document.getElementById('tv2Input');
    let tv3Input = document.getElementById('tv3Input');
    let tv4Input = document.getElementById('tv4Input');
    let tv5Input = document.getElementById('tv5Input');

    let page2Btn1 = document.getElementById('page2Btn1');
    let page2Btn2 = document.getElementById('page2Btn2');

    page1Btn1.addEventListener('click', chooseTV);
    page1Btn2.addEventListener('click', chooseTV);
    page1Btn3.addEventListener('click', chooseTV);
    page1Btn4.addEventListener('click', chooseTV);
    page1Btn5.addEventListener('click', chooseTV);
    page1Btn6.addEventListener('click', chooseTV);

    page2Btn1.addEventListener('click', chooseInput);
    page2Btn2.addEventListener('click', chooseInput);


    TVonBtn.addEventListener('click', ()=>{
            tvOnOff('on');
            
    });

    TVoffBtn.addEventListener('click', () => {
            tvOnOff('off'); 
            
    });

    SwitchBtn.addEventListener('click', () => {
        
        ShowPage1();

    });


    SnapShotsBtn.addEventListener('click', () => {
        
        GetRxSnapShots();

    });


getStatus();

    
function TurnIntervalOn(_input) {
    
    if (_input == 'tx') {
        console.log('clear rx interval');
        clearInterval(rxCapture);
        clearInterval(txCapture);
        txCapture = setInterval(CaptureTXScreen, 2500);
       
    } else if(_input == 'rx'){
        console.log('clear tx interval');
        clearInterval(rxCapture);
        clearInterval(txCapture);
        rxCapture = setInterval(CaptureRXScreen, 2500);
        
    } else if(_input == 'none'){
        clearInterval(rxCapture);
        clearInterval(txCapture);
    }

}

function getStatus() {
    setInterval(RX_CH_Feedback, 10000);
}

function chooseTV(_value) {

    tvSelected = this.value;
    page1.style.zIndex = '-1';
    page2.style.zIndex = '100';
    page3.style.zIndex = '-1';
    TurnIntervalOn('tx');
}

function chooseInput(_value) {
    inputSelected = this.value;
    page1.style.zIndex = '100';
    page2.style.zIndex = '0';
    page3.style.zIndex = '-100';
    TurnIntervalOn('none');
    rxSwitch();
}

function GetRxSnapShots() {
    page1.style.zIndex = '0';
    page2.style.zIndex = '-100';
    page3.style.zIndex = '100';
    TurnIntervalOn('rx');
}
function ShowPage1() {
    page1.style.zIndex = '100';
    page2.style.zIndex = '0';
    page3.style.zIndex = '-100';
    TurnIntervalOn('none');
}

function rxSwitch() {

    if (tvSelected != 'all') {
       
        fetch(`${rxURL}${tvSelected}/cgi-bin/query.cgi?cmd=rxswitch:${inputSelected}`)
            .then(function (data) {
                // Here you get the data to modify as you please
                // callback();
                RX_CH_Feedback();
            })
        // .catch(error => console.log(error));

    } else {
        for (let i = 1; i <= 5; i++) {

            fetch(`${rxURL}` + i + `/cgi-bin/query.cgi?cmd=rxswitch:${inputSelected}`)
                .then(function (data) {
                    // Here you get the data to modify as you please
                    //  callback();
                    RX_CH_Feedback();
                })
            //.catch(error => console.log(error));
        }
    }
}

function tvOnOff(_on_off) {
    
    let on_off_cec = '';

    if (_on_off == 'on') {

        on_off_cec = 'cec_send e0:04'; // cec command for tv = ON
        alert('Turning TVs ON');
        
    } else {

        // on_off_cec = 'cec_send e0:36'  ; // cec command for tv = OFF. Old original OFF command
        on_off_cec = 'cec_send F0:36'; // cec command for tv = OFF Newer Off command
        alert('Turning TVs OFF');
        
    }

    // Turn ALL TV ON/OFF

    for (let i = 1; i <= 5; i++) {

        // Send CEC Command 
        fetch(`${rxURL}` + i + `/cgi-bin/query.cgi?cmd=${on_off_cec}`)
            .then(function (data) {
                // Here you get the data to modify as you please
            })
        // .catch(error => console.log(error));


    }

}

/***  RX_CH_Feedback()  **********************************************************************************************
            Feedback.Shows what video source each display is currently connected to.
            Poll the RX and get the TX CH ID the RX is switched to.
            Update Display label with name of video source the display is switched to
        
    **************************************************************************************************************/
function RX_CH_Feedback() {

    for (let i = 1; i <= 5; i++) {

        // Get feedback 

        fetch('http://172.31.3.' + (i) + '/cgi-bin/query.cgi?cmd=astparam g ch_select')
            .then(function (res) {
                // Here you get the data to modify as you please
                return res.text()

            })
            .then(function (data) {
                console.log(data)
                if (data == '0001') {
                    console.log('camera');
                    //console.log('tv' + i + 'Input');
                    document.getElementById('tv' + i + 'Input').classList.remove('alert');
                    document.getElementById('tv' + i + 'Input').innerText = "videocam";

                } else if (data == '0002') {
                    console.log('ad');
                    //  console.log('tv' + i + 'Input');
                    document.getElementById('tv' + i + 'Input').classList.remove('alert');
                    document.getElementById('tv' + i + 'Input').innerText = "message";
                } else { }

            })

            .catch(function () {
                // show erron on TV button when RX not detected
                document.getElementById('tv' + i + 'Input').innerText = "report_problem";
                document.getElementById('tv' + i + 'Input').classList.add('alert');
                console.log('tv'+i+'not detected')
            });


    }

}


//***** Capture Source shot of the TX and save image as TXcapture.jpg in directory *************************************//
function CaptureTXScreen() {
    
       if (snapShotCounterTX < 2) {
        snapShotCounterTX = snapShotCounterTX + 1;
    } else {
        snapShotCounterTX = 1;
    }
console.log(snapShotCounterTX)
    let URL_TX_snapShot = 'http://172.31.2.' + snapShotCounterTX;

    var img = new Image(); // TX Snapshot picture/image
        console.log(URL_TX_snapShot+'/cgi-bin/query.cgi?cmd=capture:on');

    // img.src = URL_TX_snap_shot +'/images/capture.jpg' + '?d=' + Date.now(); // update each .jpg file with date/time stamp so each has unique name
    var xhr = new XMLHttpRequest();
    xhr.open('GET', URL_TX_snapShot + '/cgi-bin/query.cgi?cmd=cd /www/images%3Becho jpg 240 1 > /dev/videoip%3Bsleep 1%3Bcat /dev/videoip > capture.jpg', true);
    xhr.send();
    xhr.onload = function () {
        if (this.status == 200) {
            img.src = URL_TX_snapShot+ '/images/capture.jpg' + '?d=' + Date.now(); // update each .jpg file with date/time stamp so each has unique name
            document.getElementById('tx' +snapShotCounterTX+'Preview').src = img.src;
            xhr.abort();
            
        }

    };
}

//***** Capture Source shot of the RX and save image as RXcapture.jpg in directory *************************************//
function CaptureRXScreen() {

if (snapShotCounterRX < 5) {
    snapShotCounterRX = snapShotCounterRX + 1;
} else {
    snapShotCounterRX = 1;
}
console.log(snapShotCounterTX)
let URL_RX_snapShot = 'http://172.31.3.' + snapShotCounterRX;

var img = new Image(); // RX Snapshot picture/image
console.log(URL_RX_snapShot + '/cgi-bin/query.cgi?cmd=capture:on');

// img.src = URL_RX_snap_shot +'/images/capture.jpg' + '?d=' + Date.now(); // update each .jpg file with date/time stamp so each has unique name
var xhr = new XMLHttpRequest();
xhr.open('GET', URL_RX_snapShot + '/cgi-bin/query.cgi?cmd=cd /www/images%3Becho jpg 240 1 > /dev/videoip%3Bsleep 1%3Bcat /dev/videoip > capture.jpg', true);
xhr.send();
xhr.onload = function () {
    if (this.status == 200) {
        img.src = URL_RX_snapShot + '/images/capture.jpg' + '?d=' + Date.now(); // update each .jpg file with date/time stamp so each has unique name

        document.getElementById('rx' + snapShotCounterRX + 'Preview').src = img.src;
        xhr.abort();

    }

};

}


