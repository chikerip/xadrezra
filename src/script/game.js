import { getDocGame, setDocGame } from "./firebase.js";
const searchParams = new URLSearchParams(window.location.search);
let id = searchParams.get('id');
let scene = document.getElementById('scene'), gameStatus = null, turn = null, youTurn = null,player = null, oneTimeSnapshot = false, oneTimePiece = false;
let running = false;

function createGame(){
    let letters = ['a','b','c','d','e','f','g','h'];
    let inverce = false, y = -15;

    letters.forEach((elm) => {
        let i = 1
        while(i < 9){
            if(inverce == true){
                if(i%2 == 0){
                    let box = document.createElement('a-box');
                        box.setAttribute("color", "black");
                        box.setAttribute("position", `${(i - 1) * 5} -1 ${y}`)
                        box.setAttribute("scale", `5 2 5`)
                        box.setAttribute("class", `${elm + i}`)
                    scene.appendChild(box);
                }
                if(i%2 == 1){
                    let box = document.createElement('a-box');
                        box.setAttribute("color", "white");
                        box.setAttribute("position", `${(i - 1) * 5} -1 ${y}`)
                        box.setAttribute("scale", `5 2 5`)
                        box.setAttribute("class", `${elm + i}`)
                    scene.appendChild(box);
                }
            } else if (inverce == false){
                if(i%2 == 1){
                    let box = document.createElement('a-box');
                        box.setAttribute("color", "black");
                        box.setAttribute("position", `${(i - 1) * 5} -1 ${y}`)
                        box.setAttribute("scale", `5 2 5`)
                        box.setAttribute("class", `${elm + i}`)
                    scene.appendChild(box);
                }
                if(i%2 == 0){
                    let box = document.createElement('a-box');
                        box.setAttribute("color", "white");
                        box.setAttribute("position", `${(i - 1) * 5} -1 ${y}`)
                        box.setAttribute("scale", `5 2 5`)
                        box.setAttribute("class", `${elm + i}`)
                    scene.appendChild(box);
                }

            }
            i++
        }

        inverce = !inverce
        y += 5
    })

    setTimeout(()=>{
        reloadGame()
    },5000)
}

async function reloadGame(){
    async function piececreator(){
        const doc = await getDocGame(id);
        gameStatus = doc.gameData;

        gameStatus.forEach((obj) => {
            let box = document.getElementsByClassName(obj.position);
            let position = box[0].getAttribute('position');
    
            let piece = document.createElement('a-entity');
                    piece.setAttribute('position', `${position.x} ${position.y + 1} ${position.z}`)
                    piece.setAttribute('class', `piece ${obj.position}`)
                    piece.setAttribute('id', `${obj.type}`)
                    piece.setAttribute('gltf-model', `#${obj.piece}`)
            scene.appendChild(piece)
        });

    };

    if(oneTimePiece !== false){
        if(running == false){
            running = true;
            let allPieces = document.getElementsByClassName('piece');
            
            for(let i = 0; i < allPieces.length; i++){
                allPieces[i].remove();

                if(i == allPieces.length - 1){
                    piececreator();
                    running = false;
                }
            }
        }
    } else {
        oneTimePiece = !oneTimePiece;
        piececreator();
    };
}

export function camera(data){
    let rig = document.getElementById('rig');

    if(oneTimeSnapshot == false){
        if(data.players == 2){
            youTurn = !data.turn;
            player = data.players;
            rig.setAttribute('position', '20 30 -30');
            rig.setAttribute('rotation', '-50 180 0');
    
        } else if (data.players == 1){
            youTurn = data.turn;
            player = data.players;
            rig.setAttribute('position', '20 30 30');
            rig.setAttribute('rotation', '-50 0 0');
        }
        oneTimeSnapshot = !oneTimeSnapshot;
    } else {
        reloadGame();
    }

    turn = data.turn

    let cursor = document.createElement('a-cursor');
        cursor.setAttribute("color", "red");
        cursor.setAttribute("id", "cursor");

    let cameraa = document.getElementById('camera');
        cameraa.appendChild(cursor);

    createGame();
}