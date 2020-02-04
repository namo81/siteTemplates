// calendar
// 서남호(namo) - for m.s.p
// 2018-08-08 - ver1.0 - 기본 단독형


$.fn.nCalendar = function(option){

	var set = $.extend({
		inp : this,
		showType : 'button',	
		changeMon : true,
		changeYear : true,
		yearRange : '1990:2040',
		showBtnPanel : true,
		closeBtnTx : '닫기',
		todayBtnTx : '오늘',
		nextTx : '>',
		prevTx : '<'
	}, option);
		
	//초기 세팅	
	var now = new Date(),
		thisYear = now.getFullYear(), // 오늘 날짜 포함된 연도 - today 설정용
		thisMonth = now.getMonth(), // 오늘 날짜 포함된 월
		today = now.getDate(), // 오늘 날짜
		selYear, selMonth, selDay, // 선택된 날짜용 변수
		year, month, day; // 달력 생성용 변수
		//alert(year + "." + month + 1 + "." + day); // month는 0부터 시작하기 때문에 +1을 해야됨
	

	//연도 range 관련
	var minYear, maxYear;

	if(set.yearRange != null){
		minYear = Number(set.yearRange.split(':')[0]),
		maxYear = Number(set.yearRange.split(':')[1]);
		//console.log(minYear, maxYear);
	}

	var sDate,firstDay,yoil;

	var chkYoil = function(){ //월 시작일의 요일 확인
		sDate = new Date(year, month, 1);
		firstDay = sDate.getDate();
		yoil = sDate.getDay();
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
		selYear = year;
		selMonth = month;
		selDay = day;
	}
	
	// 각 월의 요일 수
	var nalsu = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
	
	// 요일 표기
	var weekTx = new Array("일", "월", "화", "수", "목", "금", "토");

	//2월은 윤년 체크
	if(year % 4 === 0 && year % 100 !== 0 || year % 400 === 0 ){
		nalsu[1] = 29;
	}

	//body 에 달력 div 생성
	$('body').append('<div id="cal-wrap"><div id="cal-area"></div></div>');
	
	var $inp = set.inp, // 초기 모든 inp 에 버튼 추가를 위한 변수
		$wrap = $('#cal-wrap'),
		$cal = $wrap.children('#cal-area'),
		$btn, // 달력 띄우는 버튼
		$control, // 연/월 제어 상단 영역
		$prevM, // 이전달 버튼
		$nextM, // 다음달 버튼
		$monthSelect, // 월 선택 select
		$yearSelect, // 연 선택 select
		$btnArea, // 오늘/닫기 버튼 영역
		$closeBtn, // 닫기 버튼
		$todayBtn, // 오늘 버튼
		$tgInp; // 날짜 선택 시 값이 입력될 input 

	// 달력 설정
	var calendarOn = function(){ // 설정된 연,월,일로 달력 생성 및 기능 적용 (show X)
		if(set.changeMon == true) monthSet();
		if(set.changeYear == true && set.changeMon == true) yearSet();
		chkYoil();
		makeCalendar(yoil, nalsu[month],year,month + 1, day);
		$cal.html(str);	
		setday();
		inpSet();
	}, calendarShow = function( tg ){ // 달력 show 함수 + input 값 체크로 연,월,일 설정함수 호출
		if(tg.val().length > 0) setYoil(tg); // input 에 설정된 날짜가 있을 경우 해당 날짜 연/월/일 세팅
		else resetYoil(); // input 이 비어있을 경우 오늘 날짜 연/월/일 세팅
		calendarOn(); 

		// 달력 위치 설정 - input 기준
		var Top = tg.offset().top + tg.outerHeight(),
			Left = tg.offset().left;
		$wrap.addClass('on').css({
			'top':''+Top+'px',
			'left':''+Left+'px',
		});;
	}

	// show type 설정 : 버튼 / input focus / both
	if(set.showType == 'button'){
		$inp.after('<button type="button" class="btn-cal">달력보기</button>');
		$btn = $('.btn-cal');
		$btn.click(function(){ 
			$tgInp = $(this).prev('input'); // 날짜 선택 시 값이 입력될 input 지정
			calendarShow($tgInp);
		});
	} else if(set.showType == 'input'){
		$inp.focus(function(){
			$tgInp = $(this);
			calendarShow($tgInp);
		});
	} else if(set.showType == 'both'){
		$inp.after('<button type="button" class="btn-cal">달력보기</button>');
		$btn = $('.btn-cal');
		$inp.focus(function(){
			$tgInp = $(this);
			calendarShow($tgInp);
		});
		$btn.click(function(){
			$tgInp = $(this).prev('input');
			calendarShow($tgInp);
		});
	} 

	//	상단 연/월 설정 영역  ==========================================================================
	// 달력 상단 연,월 제어 버튼 영역 생성
	if(set.changeMon == true){
		$wrap.prepend('<div class="cal-top"></div>');
		$control = $('.cal-top');	

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

		$monthSelect = $('.sel-month'),
		$prevM = $('.cal-btn.prev'),
		$nextM = $('.cal-btn.next');

		monthChange();

		if(set.changeYear == true) {
			$yearSelect = $('.sel-year');
			yearChange();
		}
		$prevM.click(function(){
			if(month > 0) month--;
			else {
				year--;
				month = 11;
			}
			calendarOn();
		});
		$nextM.click(function(){
			if(month < 11) month++;
			else { 
				year++;
				month = 0;
			}
			calendarOn();
		});
	} else {
		null;
	}

	// month select 기능 함수
	function monthChange(){
		$monthSelect.on('change',function(){
			month = Number($(this).val()) - 1;
			calendarOn();
		});
	}
	// month select 현재 월 설정 함수
	function monthSet(){ 
		var opt = $monthSelect.children('option');
		opt.each(function(){
			$(this).prop('selected',false); 
			if($(this).val() == month +1) $(this).prop('selected',true);
		});
	}

	// year select 기능 함수
	function yearChange(){
		$yearSelect.on('change',function(){
			year = $(this).val();
			calendarOn();
		});
	}
	// year select 현재연도 설정 함수
	function yearSet(){ 
		var opt = $yearSelect.children('option');
		opt.each(function(){
			$(this).prop('selected',false); 
			if($(this).val() == year) $(this).prop('selected',true);
		});
	}
	
	// 하단 버튼 영역 설정 ==========================================================================
	if(set.showBtnPanel == true){
		$wrap.append('<div class="cal-btns"></div>');
		$btnArea = $('.cal-btns');
		if(set.todayBtnTx != null){
			$btnArea.append('<button type="button" class="btn-cal-today">'+set.todayBtnTx+'</button>');
			$todayBtn = $('.btn-cal-today');
		}
		if(set.closeBtnTx != null){
			$btnArea.append('<button type="button" class="btn-cal-close">'+set.closeBtnTx+'</button>');
			$closeBtn = $('.btn-cal-close');
		}
		$todayBtn.click(function(){
			resetYoil();
			calendarOn();
		});

		$closeBtn.click(function(){
			$wrap.removeClass('on'); 
			$cal.empty();
		});
	}
	
	// input 값 입력 함수
	function inpSet(){ 
		var $btnDay = $cal.find('button');
		$btnDay.each(function(){
			$(this).click(function(){
				var $month = Number(month+1),
					$day = Number($(this).text());
				if($month < 10) $month = '0'+$month;
				if($day < 10) $day = '0'+$day;

				$tgInp.val(''+year+'-'+$month+'-'+$day+'').focus();
				$wrap.removeClass('on'); 
				$cal.empty();
			});
		});
	}

	// 오늘 및 선택된 날짜 클래스 추가
	function setday(){
		var $btnDay = $cal.find('button');
		// today 설정
		if(year == thisYear && month == thisMonth){
			$btnDay.each(function(){
				if($(this).text() == today) $(this).addClass('today');
			});
		}
		if($tgInp.val().length > 0){
			if(year == selYear && month == selMonth){
				$btnDay.each(function(){
					if($(this).text() == selDay) $(this).addClass('select-day');
				});
			}
		}
	}
		
	var str= "";
	function makeCalendar(yoil, nalsu, year, month, day) {
		str = "<table border ='0'>";
		//str += "<caption>달력</caption><thead>";
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
		//alert("이번달은 " + ju + " 주 동안 계속됩니다");
		for(var r=0; r < ju; r++){
			str += "<tr style='text-align:center'>";
			for(var col=0; col < 7; col++){
				if(currentCell < yoil || no > nalsu){
					str += "<td>&nbsp;</td>";
					currentCell++;
				}else{
					str += "<td><button type='button'>" + no + "</button></td>";
					no++;
				}
				
			}
			//str += "<td>&nbsp;</td>";
			
			str += "</tr>";
		}
		
		str += "</tbody></table>";
	}
}