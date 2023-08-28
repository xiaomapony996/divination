// index.js
Page({
  data: {
    wish: '', // 默认的 wish 文本
    result: '', // 默认的 result 文本
    images: [], // 图片数组
    currentImageIndex: 0, // 当前图片索引
    currentImageUrl: '', // 当前图片地址
    animation: {}, // 动画对象
    animationDuration: 1500, // 动画持续时间
    isAnimating: false, // 是否正在播放动画
    isAudioPlaying: true, // 是否播放音效的状态，默认为开启
  },

  onLoad: function () {
    this.initImagesArray(); // 初始化图片数组
    this.resetCurrentImage(); // 重置当前图片
    // 初始化音频对象
    this.audioContext = wx.createInnerAudioContext();
    this.audioContext.src = '/pages/audio/music.m4a'; // 替换成你的音频文件的URL
    this.audioContext.loop = false; // 设置为不循环播放
  },

  // 点击茭杯图像触发的事件
  handleImageTap: function () {
    if (!this.data.isAnimating) {
      this.setData({
        result: '', // 每次点击前重置 result 数据
      });

      this.initImagesArray(); // 每次点击前重置图片数组
      this.addRandomArrayToImages(); // 添加随机数组

      // 如果音效开启，则播放 BGM
      if (this.data.isAudioPlaying) {
        this.playBGM();
      }

      this.playImagesSequentially(); // 播放图片动画
    }
  },

  // 初始化图片数组
  initImagesArray: function () {
    this.setData({
      images: ['1', '2', '1', '2', '1', '2', '3', '3', '4', '4', '5', '5', '6', '6'],
    });
  },

  // 向图片数组添加随机数组
  addRandomArrayToImages: function () {
    const predefinedNumbers = [7, 7, 9, 11];
    const randomIndex = Math.floor(Math.random() * predefinedNumbers.length);
    const selectedNumber = predefinedNumbers[randomIndex];
    const newArray = [selectedNumber, selectedNumber, selectedNumber, selectedNumber + 1];

    // 将新数组添加到图片数组中
    this.setData({
      images: [...this.data.images, ...newArray],
    });

    // 播放图片动画并更新结果
    this.playImagesSequentiallyAndUpdateResult(selectedNumber);
  },

  // 播放图片动画并更新结果
  playImagesSequentiallyAndUpdateResult: function (selectedNumber) {
    this.setData({
      isAnimating: true,
    });

    const images = this.data.images;
    const numImages = images.length;
    let currentIndex = 0;

    const playNextImage = () => {
      if (currentIndex < numImages) {
        const nextImageUrl = images[currentIndex];

        this.setData({
          currentImageUrl: nextImageUrl,
        });

        currentIndex++;

        const speedUpFactor = 6;
        const remainingImages = numImages - currentIndex - 1;
        const intervalDuration = remainingImages > 0
          ? (this.data.animationDuration - 200) / (remainingImages + speedUpFactor)
          : 0;

        setTimeout(() => {
          playNextImage();

          if (currentIndex === numImages) {
            this.updateResult(selectedNumber);
          }
        }, intervalDuration);
      } else {
        this.setData({
          isAnimating: false,
        });
      }
    };

    playNextImage();
  },

  // 播放 BGM
  playBGM: function () {
    this.audioContext.play();
  },

  // 更新结果文本
  updateResult: function (selectedNumber) {
    let resultText = '';

    if (selectedNumber === 7) {
      resultText = '胜杯,表示神明允许、同意';
    } else if (selectedNumber === 9) {
      resultText = '怒杯,表示神明否定、愤怒';
    } else if (selectedNumber === 11) {
      resultText = '笑杯,表示神明一笑、不解';
    }

    this.setData({
      result: resultText,
      wish: resultText,
    });

    // 如果音效开启，则停止 BGM
    if (this.data.isAudioPlaying) {
      this.audioContext.stop();
    }
  },

  // 切换音效状态（开启/关闭）
  toggleAudio: function () {
    this.setData({
      isAudioPlaying: !this.data.isAudioPlaying,
    });
  },

  // 重置按钮点击事件
  handleReset: function () {
    this.setData({
      wish: '',
      result: '',
      currentImageIndex: 0,
      isAnimating: false,
      isAudioPlaying: true,
    });

    // 如果音效开启，则停止 BGM
    if (this.data.isAudioPlaying) {
      this.audioContext.stop();
    }

    // 重置当前图片
    this.resetCurrentImage();
  },

  // 重置当前图片和图片地址
  resetCurrentImage: function () {
    const defaultImageIndex = 0;
    this.setData({
      currentImageUrl: this.data.images[defaultImageIndex],
    });
  },

  // 输入框内容变化事件
  onInput: function (e) {
    this.setData({
      text: e.detail.value,
    });
  },
  // 设置转发时的标题、路径和图片
  onShareAppMessage: function () {
    return {
      title: '遇事不决，可问老爷', // 转发的标题
      path: '/pages/index/index', // 转发的路径，应该对应小程序的页面路径
      imageUrl: '/pages/image/share.png' // 转发的图片，可以是本地路径或网络链接
    }
  }  
});
