let APP_ID = process.env.APP_ID

let token = null;
let uid = String(Math.floor(Math.random()*10000));

let client;
let channel;

let localStream;
let remoteStream;
let peerConnection; 


const servers = {
    iceservers: [
        {
            urls: ['stun.l.google.com:19302','stun1.l.google.com:19302']
        }
    ]
}

const constraints = {
    video: true,
    audio: true,
};

let init = async () => {
    try {

        client = await AgoraRTM.createInstance(APP_ID);
        await client.login({uid,token});
        
        localStream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log('Got MediaStream Access!');
        document.getElementById('user-1').srcObject = localStream;
    } catch (error) {
        console.log('Error Accessing media Devices', error);
    }

    createOffer();
};

let createOffer = async () =>{
    peerConnection = new RTCPeerConnection(servers);

    remoteStream = new MediaStream();
    document.getElementById('user-2').srcObject = remoteStream;

    localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track,localStream);
    });

    peerConnection.ontrack = (event) =>{
        event.streams[0].getTracks().forEach((track)=>{
            remoteStream.addTrack(track);
        });
    }

    //generate ice candidates: 
    peerConnection.onicecandidate = async(event)=>{
        if(event.candidate){
            console.log('New ICE candidate', event.candidate);
        }
    }

    //create new offer: 
    let offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
};


init();
