// index.js
Page({
  data: {
    wish: '', //默认的wish文本
    result: '', // 默认的 result 文本
    images: [],
    currentImageIndex: 0,
    currentImageUrl: '',
    animation: {},
    animationDuration: 1500,
    isAnimating: false,
  },

  onLoad: function () {
    this.initImagesArray(); // 初始化图片数组
    this.setData({
      currentImageUrl: this.data.images[this.data.currentImageIndex]
    });
  },

  handleImageTap: function () {
    if (!this.data.isAnimating) {
      this.setData({
        result: '' // 每次点击前重置 result 数据
      });

      this.initImagesArray(); // 每次点击前重置图片数组
      this.addRandomArrayToImages(); // 添加随机数组
      this.playImagesSequentially(); // 播放图片动画
    }
  },

  initImagesArray: function () {
    // 初始化图片数组
    this.setData({
      images: ['1', '2', '1', '2', '1', '2', '3', '3', '4', '4', '5', '5', '6', '6']
    });
  },

  addRandomArrayToImages: function () {
    const predefinedNumbers = [7, 7, 9, 11];
    const randomIndex = Math.floor(Math.random() * predefinedNumbers.length);
    const selectedNumber = predefinedNumbers[randomIndex];

    // 根据选取的数字构建新数组
    const newArray = [selectedNumber, selectedNumber, selectedNumber, selectedNumber + 1];

    // 将新数组添加到图片数组中
    this.setData({
      images: [...this.data.images, ...newArray]
    });

    // 播放图片动画
    this.playImagesSequentiallyAndUpdateResult(selectedNumber);
  },

  playImagesSequentiallyAndUpdateResult: function (selectedNumber) {
    this.setData({
      isAnimating: true
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

        // 调整这个常数值来控制后面播放的速度
        const speedUpFactor = 6;

        const remainingImages = numImages - currentIndex - 1;
        const intervalDuration = remainingImages > 0
          ? (this.data.animationDuration - 200) / (remainingImages + speedUpFactor)
          : 0;

        setTimeout(() => {
          // 递归调用播放下一张图片
          playNextImage();

          if (currentIndex === numImages) {
            // 所有图片动画播放完成后，根据选取的数字更新 result
            this.updateResult(selectedNumber);
          }
        }, intervalDuration);
      } else {
        this.setData({
          isAnimating: false
        });
      }
    };

    // 开始播放
    playNextImage();
  },

  updateResult: function (selectedNumber) {
    let resultText = '';

    if (selectedNumber === 7) {
      resultText = '胜杯,表示神明允许、同意';
    } else if (selectedNumber === 9) {
      resultText = '怒杯,表示神明否定、愤怒';
    } else if (selectedNumber === 11) {
      resultText = '笑杯,表示神明一笑、不解';
    }

    // 更新 result 的文本
    this.setData({
      result: resultText
    });

    // 额外赋值给 wish
    this.setData({
      wish: resultText  
  });

  },

  onInput(e) {
    this.setData({
      text: e.detail.value
    })
  },

})








