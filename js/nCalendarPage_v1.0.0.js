// calendar
// 서남호(namo) - for m.s.p
// 2019-07-31 - 페이지 내 삽입형 달력


$.fn.nCalendarPage = function(option){

	this.each(function(){
		var set = $.extend({
			wrap : this,
			changeMon : true,
			changeYear : true,
			yearRange : '2019:2040',
			showBtnPanel : true,
			closeBtnTx : '닫기',
			todayBtnTx : '오늘',
			nextTx : '>',
			prevTx : '<',
			todayLimit : null, // 오늘 기준 선택 제한
			limitType : null // null : 오늘 이전 날짜 선택 제한 / after : 오늘 이후 날짜 선택 제한
		}, option);
			
		//초기 세팅	
		var now = new Date(),
			thisYear = now.getFullYear(), // 오늘 날짜 포함된 연도 - today 설정용
			thisMonth = now.getMonth(), // 오늘 날짜 포함된 월
			today = now.getDate(), // 오늘 날짜
			activeYear, activeMonth, activeDay, // 선택된 날짜용 변수
			year, month, day; // 달력 생성용 변수
			//alert(year + "." + month + 1 + "." + day); // month는 0부터 시작하기 때문에 +1을 해야됨
		

		//연도 range 관련
		var minYear, maxYear;

		if(set.yearRange != null){
			minYear = Number(set.yearRange.split(':')[0]),
			maxYear = Number(set.yearRange.split(':')[1]);
			if(set.todayLimit == true) {
				if(set.limitType == 'after') maxYear = thisYear;
				else minYear = thisYear;
			}
		}

		var startDay,yoil;

		var chkYoil = function(){ //월 시작일의 요일 확인
			startDay = new Date(year, month, 1);
			yoil = startDay.getDay();		
			//alert(yoil); // 일:0, 월:1 ~ 토:6
		}, resetYoil = function(){ // 연/월/일 변수 - 오늘 날짜로 초기화
			now = new Date(),
			year = now.getFullYear(),
			month = now.getMonth(),
			day = now.getDate();
		}, setYoil = function( tg ){ // input 에 값이 있을 경우 해당 값으로 연/월/일 설정
			var dateTx = tg.val();
			year = Number(dateTx.split('-')[0]),
			month = Number(dateTx.split('-')[1]) -1,
			day = Number(dateTx.split('-')[2]);
			// 선택된 날짜용 변수 설정
			activeYear = year;
			activeMonth = month;
			activeDay = day;
		}
		
		// 각 월의 요일 수
		var nalsu = new Array(31,28,31,30,31,30,31,31,30,31,30,31);	
		// 요일 표기
		var weekTx = new Array("일", "월", "화", "수", "목", "금", "토");
		//2월은 윤년 체크
		if(year % 4 === 0 && year % 100 !== 0 || year % 400 === 0 ){
			nalsu[1] = 29;
		}

		var $wrap = $(set.wrap),
			$inp = $wrap.find('input'), // 초기 모든 input 에 버튼 추가를 위한 변수
			$calwrap, // 달력 전체 wrap
			$cal, // 달력 테이블 영역
			$control, // 연/월 제어 상단 영역
			$prevM, // 이전달 버튼
			$nextM, // 다음달 버튼
			$monthSelect, // 월 선택 select
			$yearSelect, // 연 선택 select
			$btnArea, // 오늘/닫기 버튼 영역
			$todayBtn; // 오늘 버튼

		//body 에 달력 div 생성
		$wrap.append('<div class="cal-wrap in-page"><div class="cal-area"></div></div>');
		$calwrap = $wrap.find('.cal-wrap'),
		$cal = $wrap.find('.cal-area');

		// 달력 상단 select 및 이전,이후 버튼 영역 생성
		if(set.changeMon == true){
			$calwrap.prepend('<div class="cal-top"></div>');
			$control = $calwrap.find('.cal-top');	

			var cntstr ="";
			cntstr += '<button type="button" class="cal-btn prev">'+set.prevTx+'</button>';
			
			//연 선택 select
			if(set.changeYear == true){
				cntstr += '<select title="연도 선택" class="sel-year">';
				for(var i = minYear; i < maxYear + 1; i++){
					cntstr += '<option value="'+i+'">'+i+'년</option>';
				}
				cntstr +='</select>';	
			}
			
			//월 선택 select
			cntstr += '<select title="월 선택" class="sel-month">'
			for( var m = 1; m< 13; m++){
				cntstr += '<option value="'+m+'">'+m+'월</option>';
			}
			cntstr +='</select>';
			cntstr += '<button type="button" class="cal-btn next">'+set.nextTx+'</button>';

			$control.append(cntstr);

			$monthSelect = $calwrap.find('.sel-month'),
			$prevM = $calwrap.find('.cal-btn.prev'),
			$nextM = $calwrap.find('.cal-btn.next');
			if(set.changeYear == true) $yearSelect = $calwrap.find('.sel-year');
		}

		// 하단 오늘/닫기 버튼 영역
		if(set.showBtnPanel == true) {
			$calwrap.append('<div class="cal-btns"></div>');
			$btnArea = $calwrap.find('.cal-btns');
			if(set.todayBtnTx != null){
				$btnArea.append('<button type="button" class="btn-cal-today">'+set.todayBtnTx+'</button>');
				$todayBtn = $calwrap.find('.btn-cal-today');
			}
		}

		// 달력 설정
		var calendarOn = function(){ // 설정된 연,월,일로 달력 생성 및 기능 적용 (show X)
			if(set.changeMon == true) monthSet();
			if(set.changeYear == true && set.changeMon == true) yearSet();
			chkYoil();
			makeCalendar(yoil, nalsu[month],year,month + 1, day);
		}, calendarShow = function( tg ){ // 달력 show 함수 + input 값 체크로 연,월,일 설정함수 호출
			if(tg.val().length > 0) setYoil(tg); // input 에 설정된 날짜가 있을 경우 해당 날짜 연/월/일 세팅
			else resetYoil(); // input 이 비어있을 경우 오늘 날짜 연/월/일 세팅
			calendarOn(); 
		}
		
		//	상단 연/월 설정 영역  ==========================================================================

		var monthChange = function(){ // month select 기능 함수
			$monthSelect.on('change',function(){
				month = Number($(this).val()) - 1;
				calendarOn();
			});
		}, monthSet = function(){  // month select 현재 월 설정 함수
			var opt = $monthSelect.children('option');
			opt.each(function(){
				$(this).prop('selected',false); 
				if($(this).val() == month +1) $(this).prop('selected',true);
			});
		}
		
		var yearChange = function(){ // year select 기능 함수
			$yearSelect.on('change',function(){
				year = $(this).val();
				calendarOn();
			});
		}, yearSet = function(){ // year select 현재연도 설정 함수
			var opt = $yearSelect.children('option');
			opt.each(function(){
				$(this).prop('selected',false); 
				if($(this).val() == year) $(this).prop('selected',true);
			});
		}

		// 달력 상단 연,월 제어 버튼 영역 생성
		if(set.changeMon == true){		
			monthChange();
			if(set.changeYear == true) yearChange();

			$prevM.click(function(){
				if(month > 0) month--;
				else {
					if( year > minYear ) year--;
					month = 11;
				}
				calendarOn();
			});
			$nextM.click(function(){
				if(month < 11) month++;
				else { 
					if( year < maxYear ) year++;
					month = 0;
				}
				calendarOn();
			});
		} else {
			null;
		}
		
		// 하단 버튼 영역 기능 설정 =====================================================================
		if(set.showBtnPanel == true){		
			$todayBtn.click(function(){
				resetYoil();
				calendarOn();
			});
		}
		

		// 달력 추가 항목 셋팅 및 닫기 ===================================================================
		// 날짜 클릭 시 output 설정
		function inpWrite(){ 
			var $btnDay = $cal.find('button');
			$btnDay.each(function(){
				$(this).click(function(){
					var $month = Number(month+1),
						$day = Number($(this).text());
					if($month < 10) $month = '0'+$month;
					if($day < 10) $day = '0'+$day;

					$inp.val(''+year+'-'+$month+'-'+$day+'');
					
					//input 에 change 이벤트 트리거
					var changeEvt = document.createEvent('Event');
					changeEvt.initEvent('change', true, false);
					$inp.dispatchEvent(changeEvt);
					
					setYoil($inp);
					setToActiveDay();
				});
			});
		}

		// 오늘 및 선택된 날짜 클래스 추가
		function setToActiveDay(){
			var $btnDay = $cal.find('button');
			// today 설정
			if(year == thisYear && month == thisMonth){
				$btnDay.each(function(){
					if($(this).text() == today) $(this).addClass('today');
				});
			}
			$btnDay.removeClass('select-day');
			if($inp.val().length > 0){
				if(year == activeYear && month == activeMonth){
					$btnDay.each(function(){
						if($(this).text() == activeDay) $(this).addClass('select-day');
					});
				}
			}
		}
		
			
		function makeCalendar(yoil, nalsu, year, month, day) {
			var str= "";
			str = "<table border ='0'>";
			str += "<caption>" + year + "년" + month + "월 달력</caption><thead>";
			str += "<tr>";
			for(var i = 0; i < weekTx.length; i++){
				str += "<th scope='col'>" + weekTx[i] + "</th>";
			}
			str += "</tr>";
			str += "</thead><tbody>";
			
			
			// 날 수 채우기
			var no = 1;
			var currentCell = 0;
			var ju = Math.ceil((nalsu + yoil) / 7);
			for(var r=0; r < ju; r++){
				str += "<tr style='text-align:center'>";
				for(var col=0; col < 7; col++){
					if(currentCell < yoil || no > nalsu){
						str += "<td>&nbsp;</td>";
						currentCell++;
					}else{
						if( set.todayLimit == true ) {
							if( set.limitType == 'after' ){
								if( year > thisYear || year == thisYear && month > thisMonth + 1 || year == thisYear && month == thisMonth +1 && no > today) str += "<td data-date='"+year+"-"+month+"-"+no+"'><button type='button' disabled>" + no + "</button></td>";
								else str += "<td data-date='"+year+"-"+month+"-"+no+"'><button type='button'>" + no + "</button></td>";
							} else {
								if( year < thisYear || year == thisYear && month < thisMonth + 1 || year == thisYear && month == thisMonth +1 && no < today ) str += "<td data-date='"+year+"-"+month+"-"+no+"'><button type='button' disabled>" + no + "</button></td>";
								else str += "<td data-date='"+year+"-"+month+"-"+no+"'><button type='button'>" + no + "</button></td>";
							}
						}  else {
							str += "<td data-date='"+year+"-"+month+"-"+no+"'><button type='button'>" + no + "</button></td>";			
						}
						no++;
					}
					
				}
				//str += "<td>&nbsp;</td>";
				
				str += "</tr>";
			}
			
			str += "</tbody></table>";
			$cal.html(str);
			setToActiveDay();
			inpWrite();
		}
		
		calendarShow($inp);
	});
	return this;
}