var createSongRow = function(songNumber, songName, songLength) {
    var template =
        '<tr class="album-view-song-item">'
    +   '<td class="song-item-number" data-song-number ="' +songNumber +'">' + songNumber + '</td>'
    +   '<td class="song-item-title">' + songName + '</td>'
    +   '<td class="song-item-duration">' + songLength + '</td>'
    +   '</tr>'
    ;

    var $row = $(template);
    var clickHandler = function() {
        var songNumber = parseInt($(this).attr('data-song-number'));
        if (currentlyPlayingSongNumber !== null) {
            var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber +'"]');
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }
        if (currentlyPlayingSongNumber !== songNumber) {
            $(this).html(pauseButtonTemplate);
            currentlyPlayingSongNumber = songNumber;
            currentSongFromAlbum = currentAlbum.songs[songNumber-1];
            updatePlayerBarSong();
	   } else if (currentlyPlayingSongNumber === songNumber) {
		    $(this).html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton);
		    currentlyPlayingSongNumber = null;
            currentSongFromAlbum = null;
	   }
    };
            
    var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
    };
        
    var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }
    };
 
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
};

var setCurrentAlbum = function(album) {
     currentAlbum = album;
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');
 
     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);
     $albumSongList.empty();
     for (var i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i+1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);
     }
 };

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
 };

var nextSong = function () {
    // get index number of current song, set prev song
    var trackIn = trackIndex(currentAlbum, currentSongFromAlbum);
    var $prevSongNum =  currentlyPlayingSongNumber;
    var albumLength = currentAlbum.songs.length; 
    //check if index number = last song if so set current to first
    if (trackIn == albumLength - 1) {
        currentSongFromAlbum = currentAlbum.songs[0];
        currentlyPlayingSongNumber = 1;
        //else set current to previous plus 1
    } else {
        currentSongFromAlbum = currentAlbum.songs[trackIn+1];
        currentlyPlayingSongNumber = $prevSongNum + 1;
    }
    //update player bar
    updatePlayerBarSong();
    
    //update previous and new buttons
    var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + $prevSongNum + '"]');
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html($prevSongNum);
    
};

var previousSong = function () {
    // get index number of current song, set prev song
    var trackIn = trackIndex(currentAlbum, currentSongFromAlbum);
    var $prevSongNum =  currentlyPlayingSongNumber;
    var albumLength = currentAlbum.songs.length; 
    //check if index number = first song if so set current to last
    if (trackIn == 0) {
        currentSongFromAlbum = currentAlbum.songs[albumLength - 1];
        currentlyPlayingSongNumber = albumLength;
        //else set current to previous minus 1
    } else {
        currentSongFromAlbum = currentAlbum.songs[trackIn-1];
        currentlyPlayingSongNumber = $prevSongNum - 1;
    }
    //update player bar
    updatePlayerBarSong();
    
    //update previous and new buttons
    var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + $prevSongNum + '"]');
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html($prevSongNum);

};



var updatePlayerBarSong = function() {
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);

    $('.main-controls .play-pause').html(playerBarPauseButton);
};


var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
});