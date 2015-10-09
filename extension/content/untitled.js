    var optionCurrent = document.createElement('option');
    optionCurrent.setAttribute('value',team._id);
    optionCurrent.innerHTML=team.name;
    teamSelect.appendChild(optionCurrent);
    GLOBALS_WEB_NOTES.teamList.forEach(function(teamOp){
        if(teamOp._id===team._id) return;
        var option = document.createElement('option');
        option.setAttribute('value',teamOp._id);
        option.innerHTML = teamOp.name;
        teamSelect.appendChild(option);
    });