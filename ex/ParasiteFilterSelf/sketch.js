let barSize = 18;
let title_on = false;
let leg_on = false;
let happy_on = false;

/*
let sketch1 = function(p) {
	let cnv;
	let faceImg;
	let fontSample;

	p.preload = function() {
		faceImg = p.loadImage('face.jpg');
		fontSample = p.loadFont('Gotham-Medium.otf');
	}

	p.setup = function() {
		cnv = p.createCanvas(640, 360);
		cnv.parent("sketch1")
	};

	p.draw = function() {
		p.background(255);
		p.imageMode(p.CENTER);
		p.image(faceImg, p.width / 2, p.height / 2, 360, 360);
		p.fill(0);
		p.rectMode(p.CENTER);
		p.rect(p.width / 2, 140, barSize * 300 / 18, 50);
		p.fill(255);
		p.textSize(40);
		p.textAlign(p.CENTER, p.CENTER);
		p.text('SAMPLE', p.width / 2, 145);
	};
};
*/

let sketch2 = function(p) {
	let cnv;
	let sliderBarSize;
	let txt_barSize;
	let txt_sticker;

	let btn_title;
	let img_title;

	let btn_leg;
	let img_leg;

	let btn_happy;
	let img_happy;

	let mv_imgs = [];
	let mv_img;
	let img_edge;

	let poseNet;
	let poses = [];

	let btn_change_img;

	let txt_modelLoading;

	p.preload = function() {
		let sampleNum = parseInt(p.random(7));
		mv_img = p.loadImage('assets/mv_sample' + sampleNum + '.jpg', imageReady);
		img_edge = p.loadImage('assets/edge.png');
		img_title = p.loadImage('assets/parasite_title.png');
		img_leg = p.loadImage('assets/leg.png');
		img_happy = p.loadImage('assets/happy.png');
	}

	function imageReady() {
		let options = {
			imageScaleFactor: 1,
			minConfidence: 0.1
		}
		poseNet = ml5.poseNet(modelReady, options);
		poseNet.on('pose', function(results) {
			poses = results;
		});
	}

	function modelReady() {
		poseNet.multiPose(mv_img)
		console.log("Model Ready.")
		txt_modelLoading.html('')
	}

	function sampleImageChange() {
		txt_modelLoading.html('LOADING...')
		poses = [];
		let sampleNum = parseInt(p.random(7));
		mv_img = p.loadImage('assets/mv_sample' + sampleNum + '.jpg', imageReady);
	}

	p.setup = function() {
		cnv = p.createCanvas(640, 360);
		cnv.parent("sketch2");
		sliderBarSize = p.createSlider(18, 40, 18);
		sliderBarSize.position(cnv.position().x + 375, cnv.position().y + 32);
		sliderBarSize.style('width', '200px');

		txt_barSize = p.createP('BAR SIZE: ' + barSize);
		txt_barSize.position(cnv.position().x + 375, cnv.position().y + 30);
		txt_sticker = p.createP('STICKERS');
		txt_sticker.position(cnv.position().x + 375, cnv.position().y + 70);

		btn_title = p.createButton('TITLE');
		btn_title.position(cnv.position().x + 375, cnv.position().y + 70);
		btn_title.style('boader', '1px white');
		btn_title.style('background-color', 'black');
		btn_title.mousePressed(btnTitleSticker);

		btn_leg = p.createButton('LEG');
		btn_leg.position(cnv.position().x + 440, cnv.position().y + 70);
		btn_leg.style('boader', '1px white');
		btn_leg.style('background-color', 'black');
		btn_leg.mousePressed(btnLegSticker);

		btn_happy = p.createButton('HAPPY');
		btn_happy.position(cnv.position().x + 492, cnv.position().y + 70);
		btn_happy.style('boader', '1px white');
		btn_happy.style('background-color', 'black');
		btn_happy.mousePressed(btnHappySticker);

		btn_change_img = p.createButton('CHANGE SAMPLE');
		btn_change_img.position(cnv.position().x + 492, cnv.position().y + 70);
		btn_change_img.style('boader', '1px white');
		btn_change_img.style('background-color', 'black');
		btn_change_img.mousePressed(sampleImageChange);

		txt_modelLoading = p.createP('LOADING...');
		txt_modelLoading.position(cnv.position().x + 375 + 40, cnv.position().y + 120);
	};

	p.draw = function() {
		p.background(0);
		p.fill(0);
		p.noStroke();
		p.rect(0, 0, p.width, p.height, 6);

		p.image(mv_img, 30, 30, 360, 300);

		barSize = sliderBarSize.value();
		sliderBarSize.position(cnv.position().x + 375 + 40, cnv.position().y + 240);

		txt_barSize.html('BAR SIZE: ' + barSize);
		txt_barSize.position(cnv.position().x + 375 + 40, cnv.position().y + 210);

		txt_sticker.position(cnv.position().x + 375 + 40, cnv.position().y + 270);

		btn_title.position(cnv.position().x + 375 + 40, cnv.position().y + 300);
		btn_leg.position(cnv.position().x + 440 + 40, cnv.position().y + 300);
		btn_happy.position(cnv.position().x + 492 + 40, cnv.position().y + 300);

		btn_change_img.position(cnv.position().x + 375 + 40, cnv.position().y + 170);

		if (poses.length > 0) {
			//console.log(poses.length);
			for (let i = 0; i < poses.length; i++) {
				let pose = poses[i].pose;
				let rightEye = pose['rightEye'];

				let x1 = rightEye.x + 30;
				let y1 = rightEye.y + 30;

				let leftEye = pose['leftEye'];
				let x2 = leftEye.x + 30;
				let y2 = leftEye.y + 30;

				let xc = (x1 + x2) / 2;
				let yc = (y1 + y2) / 2;

				let theta = p.atan2(y2 - y1, x2 - x1);
				let distance = p.dist(x1, y1, x2, y2);
				let rmin = 1.8;
				let rmax = 4;

				let r = barSize / 10

				p.push();
				p.translate(xc, yc);
				p.rotate(theta);
				p.fill(0);
				p.noStroke();
				p.rectMode(p.CENTER);
				p.rect(0, 0, distance * r, distance / 2.5);
				p.fill(255);
				p.textAlign(p.CENTER, p.CENTER);
				p.textSize(distance / 4);
				p.text('SAMPLE', 0, 0);

				if (happy_on && i == 0) {
					let w = distance * 12;
					let h = w * img_happy.height / img_happy.width;
					p.imageMode(p.CENTER);
					p.image(img_happy, 0, -distance * 3, w, h);
				}

				p.pop();
			}
		}

		if (leg_on) {
			p.image(img_leg, 0 + 30, 230 + 30, 98, 43);
		}

		if (title_on) {
			p.image(img_title, 39 + 30, 180 + 30, 282, 60);
		}

		p.image(img_edge, 30, 30, 360, 300);

		p.rectMode(p.CORNER);
		p.fill(0);
		p.noStroke();
		p.rect(0, 0, p.width, 30);
		p.noFill();
		p.stroke(255);
		p.rect(0, 0, p.width, p.height, 6);
	};

	function btnTitleSticker() {
		title_on = !title_on;
		if (title_on) {
			btn_title.style('boader', '1px black');
			btn_title.style('background-color', 'white');
			btn_title.style('color', 'black');
		} else {
			btn_title.style('boader', '1px white');
			btn_title.style('background-color', 'black');
			btn_title.style('color', 'white');
		}
	}

	function btnLegSticker() {
		leg_on = !leg_on;
		if (leg_on) {
			btn_leg.style('boader', '1px black');
			btn_leg.style('background-color', 'white');
			btn_leg.style('color', 'black');
		} else {
			btn_leg.style('boader', '1px white');
			btn_leg.style('background-color', 'black');
			btn_leg.style('color', 'white');
		}
	}

	function btnHappySticker() {
		happy_on = !happy_on;
		if (happy_on) {
			btn_happy.style('boader', '1px black');
			btn_happy.style('background-color', 'white');
			btn_happy.style('color', 'black');
		} else {
			btn_happy.style('boader', '1px white');
			btn_happy.style('background-color', 'black');
			btn_happy.style('color', 'white');
		}
	}
};

let sketch3 = function(p) {
	let cnv;
	let video;
	let poseNet;
	let poses = [];

	let img_edge;
	let img_title;
	let img_leg;
	let img_happy;

	let vRatio;
	let screenRatio = 640 / 800;

	p.preload = function() {
		img_edge = p.loadImage('assets/edge.png');
		img_title = p.loadImage('assets/parasite_title.png');
		img_leg = p.loadImage('assets/leg.png');
		img_happy = p.loadImage('assets/happy.png');
	}

	p.setup = function() {
		cnv = p.createCanvas(640, 640 * p.displayHeight / p.displayWidth);

		cnv.parent("sketch3")
		p.background(0);
		p.fill(200);
		p.textAlign(p.CENTER, p.CENTER);
		p.text("LOADING...", p.width / 2, p.height / 2);

		let facingMode;

		if (p.height > p.width) {
			facingMode = {
				exact: "environment"
			}
		} else {
			facingMode = "user"
		}

		let constraints = {
			audio: false,
			video: {
				facingMode: "user"
				//facingMode: facingMode
			}
		};

		video = p.createCapture(constraints);
		//video = p.createCapture(p.VIDEO);

		video.size(p.width, p.height);

		poseNet = ml5.poseNet(video, modelReady);
		poseNet.on('pose', function(results) {
			poses = results;
		});
		video.hide();
	};

	function modelReady() {
		//select('#status').html('Model Loaded');
	}

	p.draw = function() {
		p.imageMode(p.CORNER);
		p.image(video, 0, 0, p.width, p.height);
		p.imageMode(p.CENTER);

		if (poses.length > 0) {
			//console.log(poses.length);
			for (let i = 0; i < poses.length; i++) {
				let pose = poses[i].pose;

				let rightEye = pose['rightEye'];
				let x1 = rightEye.x;
				let y1 = rightEye.y;

				let leftEye = pose['leftEye'];
				let x2 = leftEye.x;
				let y2 = leftEye.y;

				let xc = (x1 + x2) / 2;
				let yc = (y1 + y2) / 2;

				let theta = p.atan2(y2 - y1, x2 - x1);
				let distance = p.dist(x1, y1, x2, y2);
				let rmin = 1.8;
				let rmax = 4;

				let r = barSize / 10

				p.push();
				p.translate(xc, yc);
				p.rotate(theta);
				p.fill(0);
				p.noStroke();
				p.rectMode(p.CENTER);
				p.rect(0, 0, distance * r, distance / 2.5);

				if (happy_on && i == 0) {
					let w = distance * 12;
					let h = w * img_happy.height / img_happy.width;
					p.imageMode(p.CENTER);
					p.image(img_happy, 0, -distance * 3, w, h);
				}
				p.pop();
			}
		}

		if (leg_on) {
			p.imageMode(p.CORNER);
			let w = p.width * 0.25;
			let h = w * img_leg.height / img_leg.width;
			p.image(img_leg, 0, p.height * 0.8, w, h);
		}

		if (title_on) {
			p.imageMode(p.CENTER);
			let w = p.width * 0.75;
			let h = w * img_title.height / img_title.width;
			p.image(img_title, p.width * 0.5, p.height * 0.65, w, h);
		}

		p.imageMode(p.CORNER);
		p.image(img_edge, 0, 0, p.width, p.height);

	};
};

//let myp5_skch1 = new p5(sketch1);
let myp5_skch2 = new p5(sketch2);
let myp5_skch3 = new p5(sketch3);