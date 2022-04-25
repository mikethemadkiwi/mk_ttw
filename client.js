function WaitFor(duration){
    return new Promise((resolve, reject)=>{
        let thistime = setTimeout(function(){
            resolve(true);
        }, duration)
    });
}
function CollisionLoaded(entity){               
    return new Promise((resolve, reject)=>{
        let t = setInterval(function(){
            // ShowHudComponentThisFrame(17);
            if(HasCollisionLoadedAroundEntity(entity)){
                clearInterval(t);
                resolve(true);
            };
        }, 10)
    })    
}
function InteriorLoad(interiorId){
    return new Promise((resolve, reject)=>{
        let interior = setInterval(function(){
            if(IsInteriorReady(interiorId)){
                clearInterval(interior);
                resolve(true);
            };
        }, 10)
    })
}
    
function fadeScreen(state, duration){
    return new Promise((resolve, reject)=>{
        if(state==true){
            setImmediate(async () => {
                DoScreenFadeOut(duration);
            })
            let isfadescreentimer = setTick(async() => {
                ShowHudComponentThisFrame(18);
                if( IsScreenFadingOut()==false ){
                    clearTick(isfadescreentimer);
                    resolve(true)
                }
            })
        }
        else{
            setImmediate(async () => {
                DoScreenFadeIn(duration);
            })
            let isfadescreentimer = setTick(async() => {
                ShowHudComponentThisFrame(18);
                if( IsScreenFadingIn()==false ){
                    clearTick(isfadescreentimer);
                    resolve(true)
                }
            })
        }
        // let thistime = setTimeout(function(){
        //     resolve(true);
        // }, duration)
    });
}
function fadeEntity(entity, state){
    return new Promise((resolve, reject)=>{
        if(state==true){
            setImmediate(async () => {
                NetworkFadeOutEntity(entity, true, true);
            })
        }
        else{
            setImmediate(async () => {
                NetworkFadeInEntity(entity, true, true);
            })
        }
        let isfadetimer = setTick(async() => {
            ShowHudComponentThisFrame(18);
            if( NetworkIsEntityFading(entity)==false ){
                clearTick(isfadetimer);
                resolve(true)
            }
        })
    });
}
async function TeleportToExt(tX, tY, tZ, tH){
    let tpTick = setImmediate(async () => { //needs collision with exterior.
        let pPed = GetPlayerPed(-1);
        let pVeh = IsPedInAnyVehicle(pPed);
        FreezeEntityPosition(pPed, true);
        await fadeScreen(true,1000);
        await fadeEntity(pPed, true);
        if(pVeh==true){
            SetEntityCoords(GetVehiclePedIsIn(pPed, false), Number(tX), Number(tY), Number(tZ), false, false, false, true)
            SetEntityHeading(GetVehiclePedIsIn(pPed, false), Number(tH))
        }
        else{
            SetEntityCoords(pPed, Number(tX), Number(tY), Number(tZ), false, false, false, true)
            SetEntityHeading(pPed, Number(tH))
        }
        //check collision with world is present before fading
        RequestCollisionAtCoord(Number(tX), Number(tY), Number(tZ))
        await CollisionLoaded(pPed);
        // put them properly on ground.
        let gZ = GetGroundZFor_3dCoord(Number(tX), Number(tY), Number(tZ), true)
        if(pVeh==true){
            SetEntityCoords(GetVehiclePedIsIn(pPed, false), Number(tX), Number(tY), Number(gZ[2]), false, false, false, true)
            SetEntityHeading(GetVehiclePedIsIn(pPed, false), Number(tH))
        }
        else{
            SetEntityCoords(pPed, Number(tX), Number(tY), Number(gZ[2]), false, false, false, true)
            SetEntityHeading(pPed, Number(tH))
        }
        //timed wait here?!
        await fadeScreen(false,1000);
        await fadeEntity(pPed, false);
        FreezeEntityPosition(pPed, false)
    });
}
RegisterCommand('ttw', async function(source, args){
    let wpCoords = [0, 0, 71.2]
    let wpBlip = GetFirstBlipInfoId(8);
    wpCoords = GetBlipCoords(wpBlip);
    TeleportToExt(wpCoords[0], wpCoords[1], wpCoords[2], 0.0)
},false)