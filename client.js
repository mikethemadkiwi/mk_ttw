RegisterCommand('ttw', async function(source, args){
    let wpBlip = GetFirstBlipInfoId(8);
    console.log(wpBlip)
    let wpCoords = GetBlipCoords(wpBlip);
    console.log(wpCoords[0],wpCoords[1],wpCoords[2])
},false)