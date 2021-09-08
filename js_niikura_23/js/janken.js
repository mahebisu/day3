// 最初は結果は消えている
    $(".kekka_one").hide();


//今日の日付データを変数に格納
//変数は"today"とする
    var today=new Date(); 

//年・月・日・曜日を取得
    var year = today.getFullYear();
    var month = today.getMonth()+1;
    var week = today.getDay();
    var day = today.getDate();
    var week_ja= ["日","月","火","水","木","金","土"];

// サウナの訪問回数の初期設定をする
    let kaisu = {
        "kaisu0":0,"kaisu1":0,"kaisu2":0,"kaisu3":0,"kaisu4":0,"kaisu5":0
    };

    newPostRef.child("kaisu").on("child_added", function (data) {

        let v = data.val();
        let k = data.key;
        console.log(k,v);

        kaisu[k] = v;
        let knum = k.slice(5);        
        $(".doreni_kaisu_num").eq(knum).text(kaisu[k]);

    });


// サウナの訪問履歴（訪問日時、場所）を記録する配列を定義する
    let saunarireki = {};

    newPostRef.child("saunarireki").on("child_added", function (data) {

        let w = data.val();
        let l = data.key;
        let w_nichiji = w.nichiji;
        let w_basho = w.basho;
        console.log(w_nichiji,w_basho);

        // 読み込んだデータでsaunarirekiを再構成する
        saunarireki[l] = {"nichiji":w_nichiji,"basho":w_basho};

        let saunarireki_length = Object.keys(saunarireki).length;

        // 読み込んだサウナの訪問履歴を表示させる

            $(".rireki_add").prepend(
                `
                <dt>${w_nichiji}</dt>
                <dd>${w_basho}</dd>
                `
            );

    });


// 行くサウナを決めて、回数を１つ増やす

    // どこに行くかを決める
    var ransu1 = Math.random() * 6;
    var ransu2 = Math.floor(ransu1);
    console.log("決まった乱数は "+ransu2);

    if (ransu2 === 0) {
        var mokutekichi = "三越湯　サウナ";

    } else if(ransu2 === 1){
        var mokutekichi = "北欧　サウナ";

    }else if(ransu2 === 2){
        var mokutekichi = "吉の湯　サウナ";
        
    }else if(ransu2 === 3){
        var mokutekichi = "かるまる　サウナ";
        
    }else if(ransu2 === 4){
        var mokutekichi = "黄金湯　サウナ";
        
    }else if(ransu2 === 5){
        var mokutekichi = "アダムアンドイブ　サウナ";
        
    };
    console.log("目的地は "+mokutekichi);

// kekkahyojiの定義
    function kekkahyoji(){

        if (ransu2 === 0) {
            $(".kekka1").fadeIn(1000);
        } else if(ransu2 === 1){
            $(".kekka2").fadeIn(1000);
        }else if(ransu2 === 2){
            $(".kekka3").fadeIn(1000);
        }else if(ransu2 === 3){
            $(".kekka4").fadeIn(1000);
        }else if(ransu2 === 4){
            $(".kekka5").fadeIn(1000);
        }else if(ransu2 === 5){
            $(".kekka6").fadeIn(1000);
        };    

    };

// fuction kakikomiの定義
    function kakikomi(j){

        // 乱数で選んだサウナの回数を１追加する
        let kaisu_jkey = "kaisu" + j;
        kaisu[kaisu_jkey] = kaisu[kaisu_jkey] + 1;
        // （kaisu.kaisu_jkeyでは変数扱いにならなかった）

        // kaisuオブジェクトを更新する
        firebase.database().ref("kaisu").set(kaisu);
        
        // 訪問履歴をsaunarirekiオブジェクトに追加する

        let saunarireki_length = Object.keys(saunarireki).length;
        console.log("今までの訪問数は " + saunarireki_length);
        let newrirekikey = "r" + saunarireki_length;

        saunarireki[newrirekikey] = {
             "nichiji":`${month}月${day}日 (${week_ja[week]})`
            ,"basho" : mokutekichi.slice( 0, -4 ) 
        };
        
        firebase.database().ref("saunarireki").set(saunarireki);
    }


// クリックイベント
    $(document).on("click","#btn_id",function(){

        var imadoko = $("#naka").val();
        console.log(imadoko);
        var maplink = "https://www.google.com/maps/dir/?api=1&origin=" + imadoko + "&destination=" + mokutekichi + "&travelmode=transit&hl=ja";

        $("#nyuryoku_id , #doreni_id").slideUp(1000);
        $("#rireki").slideUp(200);

        $(".doreni_pic2 p").prepend(month+"月"+day+"日は<br>");

        // 定義したkekkahyoji functionを実行
        kekkahyoji();
    
        $(".kekka_a").attr("href",maplink);
        console.log("飛ぶリンクは"+maplink)

        // 定義したkakikomi funcitonを使う
        kakikomi(ransu2);

    });

// ルーレット効果


    const ruretto = function ruretto(){
        let ransu_r =  Math.floor(Math.random() * 6);

        $(".doreni_pic").eq(ransu_r).css("border","solid 10px #fecc00");

        let modosu = function modosu(){
            $(".doreni_pic").eq(ransu_r).css("border","solid 6px #003580");
        };
    
        setTimeout(modosu,500);
        
    };

    setInterval(ruretto,500);
    setInterval(ruretto,1000);
    setInterval(ruretto,200);
