import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {QRCode} from './qrdecode/qrcode'


@Component({
  moduleId: 'module.id',
  selector: 'qr-scanner',
  template: `
    <canvas id="qr-canvas" width="640" height="480" hidden="true"></canvas>
    <div id="outdiv"></div>
    <div id="mainbody"></div>
`
})
export class QrScannerComponent implements OnInit, OnDestroy {

    @Input() facing: string;
    @Output() onRead: EventEmitter<string> = new EventEmitter<string>();
    gCanvas: HTMLCanvasElement;
    gCtx: CanvasRenderingContext2D;
    qrCode = new QRCode();
    stype= 0;
    gUM = false;
    vidhtml = '<video id="v" autoplay></video>';
    v: HTMLVideoElement;
    webkit=false;
    moz = false;
    stream:any;
    stop = false;

    constructor()
    {
    }

  ngOnInit(): void {
      console.log("QR Scanner init, facing " + this.facing);
      this.load();
  }

  ngOnDestroy(){
    this.stopScanning();
  }

  stopScanning(): void{
      this.stream.getTracks()[0].stop();
      this.stop = true;

  }

  isCanvasSupported(): boolean{
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));

  }
  initCanvas(w: number,h:number ): void {
      this.gCanvas = document.getElementById("qr-canvas") as HTMLCanvasElement;
      this.gCanvas.style.width = w + "px";
      this.gCanvas.style.height = h + "px";
      this.gCanvas.width = w;
      this.gCanvas.height = h;
      this.gCtx = this.gCanvas.getContext("2d");
      this.gCtx.clearRect(0, 0, w, h);
  }

    setwebcam2(options: any): void
    {

        var self = this;
        function success(stream:any): void {
            self.stream = stream;
            if(self.webkit || self.moz)
                self.v.src = window.URL.createObjectURL(stream);
            else
                self.v.src = stream;
            self.gUM=true;
            setTimeout(captureToCanvas, 500);
        }

        function error(error: any): void {
            this.gUM=false;
            return;
        }

        function captureToCanvas():void {
            if(self.stop == true)
                return;
            if(self.stype!=1)
                return;
            if(self.gUM)
            {
                try{
                    self.gCtx.drawImage(self.v,0,0);
                    try{
                        self.qrCode.decode(self.gCanvas);
                    }
                    catch(e){
                        console.log(e);
                        setTimeout(captureToCanvas, 500);
                    };
                }
                catch(e){
                    console.log(e);
                    setTimeout(captureToCanvas, 500);
                };
            }
        }


        console.log(options);
        // document.getElementById("result").innerHTML="- scanning -";
        if(this.stype==1)
        {
            setTimeout(captureToCanvas, 500);
            return;
        }
        var n:any =navigator;
        document.getElementById("outdiv").innerHTML = this.vidhtml;
        this.v=document.getElementById("v") as HTMLVideoElement;


        if(n.getUserMedia)
        {
            this.webkit=true;
            n.getUserMedia({video: options, audio: false}, success, error);
        }
        else
        if(n.webkitGetUserMedia)
        {
            this.webkit=true;
            n.webkitGetUserMedia({video:options, audio: false}, success, error);
        }
        else
        if(n.mozGetUserMedia)
        {
            this.moz=true;
            n.mozGetUserMedia({video: options, audio: false}, success, error);
        }

        // document.getElementById("qrimg").style.opacity=0.2;
        // document.getElementById("webcamimg").style.opacity=1.0;

        this.stype=1;
        setTimeout(captureToCanvas, 500);
    }



    setwebcam():void
    {

        var options: any = true;
        if(navigator.mediaDevices && navigator.mediaDevices.enumerateDevices)
        {
            try{
                var self = this;
                navigator.mediaDevices.enumerateDevices()
                    .then(function(devices: any) {
                        devices.forEach(function(device: any) {
                            if (device.kind === 'videoinput') {
                                if(device.label.toLowerCase().search("back") >-1)
                                    options={'deviceId': {'exact':device.deviceId}, 'facingMode':'environment'} ;
                            }
                            console.log(device.kind + ": " + device.label +" id = " + device.deviceId + "facingMode = " + device);
                        });
                        self.setwebcam2(options);
                    });
            }
            catch(e)
            {
                console.log(e);
            }
        }
        else{
            console.log("no navigator.mediaDevices.enumerateDevices" );
            this.setwebcam2(options);
        }

    }


  load(): void
  {

    var self = this;
    function read(a: string):void {
      self.onRead.emit(a);
      self.stream.getTracks()[0].stop();
      self.stop = true;

    }
    if(this.isCanvasSupported())
    {
        this.initCanvas(800, 600);
        this.qrCode.myCallback = read;

        this.setwebcam();
    }
    else
    {
        document.getElementById("mainbody").style.display="inline";
        document.getElementById("mainbody").innerHTML='<p id="mp1">QR code scanner for HTML5 capable browsers</p><br>'+
            '<br><p id="mp2">sorry your browser is not supported</p><br><br>'+
            '<p id="mp1">try <a href="http://www.mozilla.com/firefox"><img src="firefox.png"/></a> or <a href="http://chrome.google.com"><img src="chrome_logo.gif"/></a> or <a href="http://www.opera.com"><img src="Opera-logo.png"/></a></p>';
    }
  }
}
