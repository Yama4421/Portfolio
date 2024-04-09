#include "defines.h"
#include "h8_sample.h"
#include "serial.h"
#include "lib.h"

#define LEDON 2
#define LEDFLASH 1
#define LEDOFF 0

/* const 宣言した場合には、変数の値を変更できない。定数として扱うことができる。 */ 
const char SEG[]={SEG_0,SEG_1,SEG_2,SEG_3,SEG_4,SEG_5,SEG_6,SEG_7,SEG_8,SEG_9,SEG_A,SEG_B,SEG_C,SEG_D,SEG_E,SEG_F};

volatile uint8 Dipsw;			/* ディップSW 0x0000～0x000F※4bitのSUM値 */
volatile uint8 Tactsw_status=0;	/* タクトSW状態 0x0000:OFF/0x0001:ON */
volatile uint8 Count=0;			/* カウンター 0x00～0xFF */
volatile uint8 tactsw_status;	/* タクトSW状態 0x0000:OFF/0x0001:ON */
volatile uint8 Led_status[4];	/* LED1～4状態 0x0000:消灯/0x0001:点滅/0x0002:点灯 */
volatile uint8 segno=0x0000;	/* 7セグ(1桁) 0x000F～0x0000*/
volatile uint8 buzzer_status;	/* ブザー状態 0x0000:停止/0x0001:鳴動 */
volatile uint8 Time_count=0;	/* タイマーカウンター 0x00～0xFF */
volatile uint8 i=0;				/* LEDパターン0~4*/
volatile uint8 updown_flag=0;	/* カウンター方向 0:アップ1:ダウン*/
volatile uint8 segno_work=0x00;	/* 今表示している７セグの値*/

#pragma interrupt
void IRQ0_interrupt()
{
	volatile uint8 t_ISR;

	t_ISR = ISR; /* リードした後、要求クリアを行う */
	ISR &= ~0x01; /* 割込要求フラグを落とす */

	PADR.BIT.B0 = ~PADR.BIT.B0; /* LED1 反転 */

}

static void wait_test(unsigned long num) 
{
	volatile long i;
	
	for(i=0;i<num;i++)
	;
	
}

uint8 buzzeron(unsigned long buzztime)
{
	uint8 Buzzer_status=0;	/* ブザー状態 0x0000:停止/0x0001:鳴動 */
	volatile long i;
	
	PBDDR.BYTE = 0; /* PBDDR をクリア */
	PBDR.BYTE = 0;  /* データレジスタクリア */
	
	PBDDR.BIT.B0 = 1; /* ビット 0＝出力 */
	
	for (i=0; i<=buzztime; i++)
	{
		PBDR.BIT.B0 = ~PBDR.BIT.B0; /* ブザー鳴動 */
		wait_test(500);
	}
	Buzzer_status = 0x01;
	return(Buzzer_status);
}

#pragma interrupt
void NMI_interrupt()
{
	Tactsw_status = 1; /* ON */
	PADR.BIT.B0 = ~PADR.BIT.B0; /* LED1 反転 */
	
	buzzer_status = buzzeron(100);
}

void timer_init()
{
	T16TCR0.BIT.B2 = 0; /* プリスケーラが1/8 */
	T16TCR0.BIT.B1 = 1;
	T16TCR0.BIT.B0 = 1;
	T16TCR0.BIT.B4 = 0; /* 立ち上がりエッジ */
	T16TCR0.BIT.B3 = 0;
	T16TCR0.BIT.B6 = 0; /* GRAのコンペアマッチで16TCNTをクリア */
	T16TCR0.BIT.B5 = 1;
	/* 1/50秒周期でタイマがかかるように設定(20MHz でプリスケーラが1/8) */
	/* GRA */
	/* カウント値"50000"を上位8ビット、下位8ビットに分けて格納 */
	GRA0L.BYTE = 50000 & 0xff; /* GRA0L */
	GRA0H.BYTE = (50000 >> 8) & 0xff; /* GRA0H */
	/* 再計算した結果、20msタイマー⇒20/1000⇒1/50秒 */
	/* つまり、20msタイマーで50回カウントルーチン作れば1秒のwait関数が作れる */
	TISRA.BIT.B4 = 1; /* 割込要求許可 */
	TSTR.BIT.B0 = 1; /* カウンター０スタート */
}

void led_init(void)
{
	PADDR.BYTE = 0; /* PADDR をクリア */
	PADR.BYTE = 0;  /* データレジスタクリア */

	PADDR.BYTE = 0x0F; /* ビット0～3＝出力 */
}

static int init(void)
{
	/* 以下はリンカ・スクリプトで定義してあるシンボル */
	extern int erodata, data_start, edata, bss_start, ebss;

	/*
	 * データ領域とBSS領域を初期化する．この処理以降でないと，
	 * グローバル変数が初期化されていないので注意．
	 */
	memcpy(&data_start, &erodata, (long)&edata - (long)&data_start);
	memset(&bss_start, 0, (long)&ebss - (long)&bss_start);

	IER = 0x01;		/* CN1 の 20番ピン IRQ0 */
	ISCR = 0x01;

	timer_init();

	ENABLE_INTR;
	
	led_init();
	
	/* シリアルの初期化 */
	serial_init(SERIAL_DEFAULT_DEVICE);

	return 0;
}

uint8 led(uint8 no, uint8 status)
{
	uint8 Led_status[4];	/* LED1～4状態 0x0000:消灯/0x0001:点滅/0x0002:点灯 */

	Led_status[no] = status; 
	
	switch (no){
				
		case 0: /* LED1 */
			if(2 == status){
				PADR.BIT.B0 = 1;  /* ビット0＝点灯 */
			}
		else if(0 == status){
				PADR.BIT.B0 = 0;  /* ビット0＝消灯 */
			}
			break;
		case 1: /* LED2 */
			if(2 == status){
				PADR.BIT.B1 = 1;  /* ビット1＝点灯 */
			}
		else if(0 == status){
				PADR.BIT.B1 = 0;  /* ビット1＝消灯 */
			}
			break;
		case 2: /* LED3 */
			if(2 == status){
				PADR.BIT.B2 = 1;  /* ビット2＝点灯 */
			}
		else if(0 == status){
				PADR.BIT.B2 = 0;  /* ビット2＝消灯 */
			}
			break;
		case 3: /* LED4 */
			if(2 == status){
				PADR.BIT.B3 = 1;  /* ビット3＝点灯 */
			}
		else if(0 == status){
				PADR.BIT.B3 = 0;  /* ビット3＝消灯 */
			}
			break;
	}


	return(Led_status[no]);
}

uint8 dipswin(void)
{
	uint8 dipswdata;
	
	P5DDR.BYTE = 0;		/* P5DDR をクリア */
	P5DR.BYTE = 0;		/* P5DR をクリア */
	
	P5DDR.BYTE = 0x00;	/* ビット 0～3＝0:入力 */
	P5PCR.BYTE = 0x0F;	/* ビット 0～3＝1:入力プルアップ MOS_ON */
	
	dipswdata = (~P5DR.BYTE & 0x0f);

	return(dipswdata);
}

void segon(unsigned char dipswdata)
{
	P4DDR.BYTE = 0; /* P4DDR をクリア */
	P4DR.BYTE = 0;  /* データレジスタクリア */
	P4DDR.BYTE = 0xff; /* ビット 0～7＝出力 */
	P4DR.BYTE = SEG[dipswdata]; /* 7 セグ出力 */
}

void data_send()
{
/* 送信データ作成 */
	puts("DAT010100");
	putxval((uint32)Dipsw, 2);			/*  */
	puts("020200");
	putxval((uint32)Tactsw_status, 2);	/*  */
	puts("030300");
	putxval((uint32)Led_status[0], 2);	/*  */
	puts("040300");
	putxval((uint32)Led_status[1], 2);	/*  */
	puts("050300");
	putxval((uint32)Led_status[2], 2);	/*  */
	puts("060300");
	putxval((uint32)Led_status[3], 2);	/*  */
	puts("070400");
	putxval((uint32)segno, 2);			/*  */
	puts("080500");
	putxval((uint32)buzzer_status, 2);	/*  */
	puts("090600");
	putxval((uint32)Count, 2);			/*  */
	puts("\n");
}

#pragma interrupt
void timer_interrupt()
{
	int status;
	uint8 ledno;			/* LEDNo. */
	
	Dipsw = dipswin();					/* DipSW読み込み */

	/*いったん読んでからIMFA0にゼロを書き込むことで割り込みフラグを落とす */
	status = TISRA.BIT.B0;
	if(status == 1) {					/* 割込要求フラグが立つ */
		TISRA.BIT.B0 = 0;				/* 割込要求フラグを落とす */
		if(0x01 == (Dipsw&0x01)){
			PADR.BIT.B0 = ~PADR.BIT.B0;
			Led_status[0] = LEDFLASH;
		}
		if(0x02 == (Dipsw&0x02)){
			PADR.BIT.B1 = ~PADR.BIT.B1;
			Led_status[1] = LEDFLASH;
		}
		if(0x04 == (Dipsw&0x04)){
			PADR.BIT.B2 = ~PADR.BIT.B2;
			Led_status[2] = LEDFLASH;
		}
		if(0x08 == (Dipsw&0x08)){
			PADR.BIT.B3 = ~PADR.BIT.B3;
			Led_status[3] = LEDFLASH;
		}
	}
	
	
	if(0x0f >= Time_count){
		Time_count++;
	}else{
		Time_count = 0;
	}
	if(0x05 == Time_count){	/* 100msecごとにカウントアップ */
		if(0==i)
		{
			for(ledno=0; ledno<=3; ledno++)
			{
				Led_status[ledno]=LEDOFF;
				Led_status[ledno]=led(ledno, Led_status[ledno]);
			}
			i++;
		}
		else if(1==i)
		{
			Led_status[ledno]=led(0, LEDON);
			for(ledno=1; ledno<=3; ledno++)
			{
				Led_status[ledno]=LEDOFF;
				Led_status[ledno]=led(ledno, Led_status[ledno]);
			}
			i++;
			
		}
		else if(2==i)
		{
			Led_status[ledno]=led(0, LEDON);
			Led_status[ledno]=led(1, LEDON);
			for(ledno=2; ledno<=3; ledno++)
			{
				Led_status[ledno]=LEDOFF;
				Led_status[ledno]=led(ledno, Led_status[ledno]);
			}
			i++;
			
		}
		else if(3==i)
		{
			for(ledno=0; ledno<=2; ledno++)
			{
				Led_status[ledno]=LEDON;
				Led_status[ledno]=led(ledno, Led_status[ledno]);
			}
			i++;
			
		}
		else if(4==i)
		{
			for(ledno=0; ledno<=3; ledno++)
			{
				Led_status[ledno]=LEDON;
				Led_status[ledno]=led(ledno, Led_status[ledno]);
			}
			i=0;
			
		}
		
		if(0xff >= Count){	/* Count 0～255(0xff) */
			Count++;
		}else {
			Count = 0;
		}
		if(updown_flag==0){
			if(segno < 0x000f){
				if(segno%2==0){
					buzzer_status = buzzeron(100);
				}
				segon(segno++);
			}else{
				if(segno%2==0){
					buzzer_status = buzzeron(100);
				}
				segon(segno);
				segno=0x000f;
				updown_flag=1;
			}
		}
		else if(updown_flag==1){
			if(segno > 0x0000){
				if(segno%2==0){
					buzzer_status = buzzeron(100);
				}
				segon(segno--);
			}else{
				if(segno%2==0){
					buzzer_status = buzzeron(100);
				}
				segon(segno);
				segno=0x0000;
				updown_flag=0;
			}
		}
	}
}

int main(void)
{
	uint8 i;
	static char buf[16];
	
	memset((void *)Led_status, 0x0000, (long)4);	/* 初期値：消灯 */
	buzzer_status = 0x0000;			/* 初期値：停止 */
	
	init();

	while (1){
		for (i=0; i<=5; i++)
		{
			gets(buf);
			if (!strcmp(buf, "REQ")){
				data_send();	/* データ送信 */
			}
			/*
			if((0 == i) || (2 == i) || (4 == i))
			{
				for (ledno=0; ledno<=3; ledno++)
				{
					Led_status[ledno] = LEDON;
					Led_status[ledno] = led(ledno, Led_status[ledno]);
				}
			}
			else if((1 == i) || (3 == i) || (5 == i))
			{
				for (ledno=0; ledno<=3; ledno++)
				{
					Led_status[ledno] = LEDOFF;
					Led_status[ledno] = led(ledno, Led_status[ledno]);
				}
			}
			*/
			Tactsw_status = 0x0000;			/* 0x0000:OFF */
			buzzer_status = 0x0000;			/* 停止 */

		}

	}
	return 0;
}
