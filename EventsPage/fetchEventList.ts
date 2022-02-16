import { TEvent } from './TEventType';

let priv: boolean = sessionStorage.getItem( "perm" ) == "priv" ? true : false ;

async function getEventList() {
  const response = await fetch ( "https://api.hackthenorth.com/v3/events" );
  const data = await response.json();
  console.log( data );
  return data;
}

function AfterFinish(eventList: TEvent[]) {

  let unSortedList = eventList;
  quickSort( eventList, 0, eventList.length - 1 );  
  let SortedEvents = eventList;

  const InfoSection = document.getElementById( "info-section" )!;
  const buttonDiv = document.getElementById("button-div")!;
  const HeadingSection = document.getElementById( "headings-section" )!;
  const DatesRelEvents = document.getElementById( "dates-and-rel-events" )!;
  const DescSect = document.getElementById( "descriptions" )!;
  const speakerSect = document.getElementById( "speaker-section" )!;
  const privLinkSect = document.getElementById( "priv-link" )!;
  const pubLinkSect = document.getElementById( "pub-link" )!;

  for( let i: number = 0; i < SortedEvents.length; i ++ ) {
    if( SortedEvents[i].permission == "private" && !priv ) continue;
    var button = document.createElement("button");
    button.innerHTML = SortedEvents[i].name;
    button.className = "event-buttons";
    buttonDiv.appendChild(button);
    button.addEventListener( "click", () => { DisplayInfo( SortedEvents[i] ) } );
  }

  var loginButton = document.getElementById( "login-button" )!;
  loginButton.addEventListener( "click", () => { window.location.href = "http://127.0.0.1:5500/First%20Try/Login%20Page/login.html" } );
  
  function DisplayInfo( event: TEvent ) {
    // clearing all previous information in each HTML section
    InfoSection.innerHTML = ""; 
    HeadingSection.innerHTML = "";
    DatesRelEvents.innerHTML = "";
    DescSect.innerHTML = "";
    speakerSect.innerHTML = "";
    privLinkSect.innerHTML = "";
    pubLinkSect.innerHTML = "";

    // Generating speaker names
    var SpeakerNames = document.createElement( "p" );
    for( let speaker of event.speakers ) {
      SpeakerNames.innerHTML = speaker.name;
      if ( speaker.profile_pic != null ) show_image( String( speaker.profile_pic ), 100, 100, speaker.name + " profile picture", speakerSect );
    }
    SpeakerNames.className = "speaker-names";
    speakerSect.appendChild( SpeakerNames );

    // Generating event description
    var EventDescription = document.createElement( "p" );
    EventDescription.innerHTML = String(event.description);
    EventDescription.className = ( "event-description" );
    DescSect.appendChild( EventDescription ); 
    
    // Generating links to access event or to provide more information
    if( event.public_url !== null ) {
      var PubEventLink = document.createElement( "a" );      
      PubEventLink.href = event.public_url!;
      PubEventLink.innerHTML = "More Information";
      PubEventLink.className = ( "pub-event-link" + "<br>" );
      pubLinkSect.appendChild( PubEventLink );
    }

    if( priv ) {
      var PrivEventLink = document.createElement( "a" );      
      PrivEventLink.href = event.private_url;
      PrivEventLink.innerHTML = "Link to Event";
      PrivEventLink.className = ( "priv-event-link" +"<br>" );
      privLinkSect.appendChild( PrivEventLink );
    }

    // Generating event title and type
    var EventTitle = document.createElement("p");
    EventTitle.innerHTML = event.name;
    EventTitle.className = "event-title";
    HeadingSection.appendChild( EventTitle );

    var EventType = document.createElement("p");
    EventType.innerHTML = displayEventType( event.event_type );
    EventType.className = "event-type";
    HeadingSection.appendChild( EventType );

    var EventTime = document.createElement("p");
    EventTime.innerHTML = "<br />" + unixToTime( event.start_time ) + " ~ " + unixToTime( event.end_time);
    EventTime.className = "event-time";
    DatesRelEvents.appendChild( EventTime );

    // Generating dates and times for event
    var EventDate = document.createElement("p");
    EventDate.innerHTML = unixToDate( event.start_time );
    EventDate.className = "event-date";
    DatesRelEvents.appendChild( EventDate );
  
    //Generating list of related events
    for( let i: number = 0; i < event.related_events.length && SortedEvents[i].related_events != event.related_events; i ++ ) {
      var RelEventLink = document.createElement( "button" );      
      RelEventLink.innerHTML = SortedEvents[i].name;
      RelEventLink.className = "related-events";
      DatesRelEvents.appendChild(RelEventLink);
      RelEventLink.addEventListener( "click", () => { DisplayInfo( unSortedList[i] ) } ); // access pre-sorted list to ensure IDs match
    }
  }
}

getEventList().then(AfterFinish);

function displayEventType( type: string ) {
  if( type == "workshop" ) return "Workshop";
  if( type == "tech_talk" ) return "Tech Talk";
  return "Activity";
}

function unixToDate( startTime: number ) {
  let start: Date = new Date(startTime); 
  let weekdate: string = start.toLocaleString("en-US", {weekday: "long"}); // Monday
  let month: string = start.toLocaleString("en-US", {month: "long"}); // December
  let day: string = start.toLocaleString("en-US", {day: "numeric"}); // 9
  return weekdate + " " + month + " " + day;
}

function unixToTime( unix_timestamp: number ) {
  let date: Date = new Date(unix_timestamp);
  let formattedHours: string = ( date.getHours() >= 12 && date.getHours() < 13 ) ? String( date.getHours( ) ) : String( date.getHours( ) % 12 );
  let formattedTime: string = formattedHours + ":" + date.getMinutes( );
  if( date.getMinutes() / 10 < 1 ) formattedTime += "0";
  console.log( formattedTime );
  return formattedTime;
}

function show_image( src: string, width: number, height: number, alt: string, section: any ) {
  if( src == null ) return;
  var img = document.createElement("img");
  img.className = "profile-picture";
  img.src = src;
  img.width = width;
  img.height = height;
  img.alt = alt;
  section.appendChild(img);
}

function swap(EventList: TEvent[], leftIndex: number, rightIndex: number) {
  var temp = EventList[leftIndex];
  EventList[leftIndex] = EventList[rightIndex];
  EventList[rightIndex] = temp;
}

function partition(EventList: TEvent[], left: number, right: number) {
  var pivot: number   =  EventList[Math.floor((right + left) / 2)].start_time, //middle element
  i: number = left, //left pointer
  j: number = right; //right pointer
  while (i <= j) {
    while ( EventList[i].start_time < pivot) {
      i++;
    }
    while ( EventList[j].start_time > pivot) {
      j--;
    }
    if (i <= j) {
      swap(EventList, i, j); //swapping two elements
      i++;
      j--;
    }
  }
  return i;
}

function quickSort(EventList: TEvent[], left: number, right: number) {
  var index: number;
  index = partition(EventList, left, right); //index returned from partition
  if (left < index - 1) { //more elements on the left side of the pivot
    quickSort(EventList, left, index - 1);
  }
  if (index < right) { //more elements on the right side of the pivot
    quickSort(EventList, index, right);
  }
}