// 主要JavaScript功能文件

// 初始化函数
document.addEventListener('DOMContentLoaded', function() {
    initParticleBackground();
    initScrollAnimations();
    initCostComparisonChart();
    initNumberCounters();
    initComparisonCards();
});

// 背景粒子效果
function initParticleBackground() {
    new p5(function(p) {
        let particles = [];
        
        p.setup = function() {
            let canvas = p.createCanvas(p.windowWidth, p.windowHeight);
            canvas.parent('p5-background');
            
            // 创建粒子
            for (let i = 0; i < 50; i++) {
                particles.push({
                    x: p.random(p.width),
                    y: p.random(p.height),
                    vx: p.random(-0.5, 0.5),
                    vy: p.random(-0.5, 0.5),
                    size: p.random(2, 6),
                    alpha: p.random(0.1, 0.3)
                });
            }
        };
        
        p.draw = function() {
            p.clear();
            
            // 绘制粒子
            particles.forEach(particle => {
                p.fill(139, 0, 0, particle.alpha * 255);
                p.noStroke();
                p.circle(particle.x, particle.y, particle.size);
                
                // 更新位置
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // 边界检测
                if (particle.x < 0 || particle.x > p.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > p.height) particle.vy *= -1;
            });
        };
        
        p.windowResized = function() {
            p.resizeCanvas(p.windowWidth, p.windowHeight);
        };
    });
}

// 滚动动画
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                if (element.classList.contains('comparison-card')) {
                    anime({
                        targets: element,
                        translateY: [50, 0],
                        opacity: [0, 1],
                        duration: 800,
                        easing: 'easeOutQuart',
                        delay: anime.stagger(200)
                    });
                }
                
                if (element.classList.contains('number-counter')) {
                    animateNumber(element);
                }
            }
        });
    }, observerOptions);
    
    // 观察所有需要动画的元素
    document.querySelectorAll('.comparison-card, .number-counter').forEach(el => {
        observer.observe(el);
    });
}

// 数字计数动画
function animateNumber(element) {
    const finalNumber = parseInt(element.textContent.replace(/,/g, ''));
    const duration = 2000;
    
    anime({
        targets: { value: 0 },
        value: finalNumber,
        duration: duration,
        easing: 'easeOutQuart',
        update: function(anim) {
            const currentValue = Math.round(anim.animatables[0].target.value);
            element.textContent = currentValue.toLocaleString();
        }
    });
}

// 成本对比图表
function initCostComparisonChart() {
    const chartDom = document.getElementById('cost-comparison-chart');
    if (!chartDom) return;
    
    const myChart = echarts.init(chartDom);
    
    const option = {
        title: {
            text: '健康投资 vs 医疗成本对比',
            left: 'center',
            textStyle: {
                fontSize: 24,
                fontWeight: 'bold',
                color: '#1A1A1A'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['健康投资', '医疗成本'],
            top: 40
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['年度成本', '5年成本', '10年成本', '20年成本']
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '¥{value}'
            }
        },
        series: [
            {
                name: '健康投资',
                type: 'bar',
                data: [7200, 36000, 72000, 144000],
                itemStyle: {
                    color: '#006633'
                },
                animationDelay: function (idx) {
                    return idx * 100;
                }
            },
            {
                name: '医疗成本',
                type: 'bar',
                data: [80000, 400000, 800000, 1600000],
                itemStyle: {
                    color: '#8B0000'
                },
                animationDelay: function (idx) {
                    return idx * 100 + 500;
                }
            }
        ],
        animationEasing: 'elasticOut',
        animationDelayUpdate: function (idx) {
            return idx * 5;
        }
    };
    
    myChart.setOption(option);
    
    // 响应式
    window.addEventListener('resize', function() {
        myChart.resize();
    });
}

// 数字计数器初始化
function initNumberCounters() {
    const counters = document.querySelectorAll('.number-counter');
    
    counters.forEach(counter => {
        const finalValue = parseInt(counter.textContent);
        
        // 初始化为0
        counter.textContent = '0';
        
        // 设置观察器
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(counter, finalValue);
                    observer.unobserve(counter);
                }
            });
        });
        
        observer.observe(counter);
    });
}

// 计数器动画
function animateCounter(element, finalValue) {
    anime({
        targets: element,
        innerHTML: [0, finalValue],
        duration: 2000,
        easing: 'easeOutQuart',
        round: 1,
        update: function(anim) {
            element.innerHTML = Math.round(anim.animatables[0].target.innerHTML).toLocaleString();
        }
    });
}

// 对比卡片交互
function initComparisonCards() {
    const cards = document.querySelectorAll('.comparison-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                scale: 1.02,
                duration: 300,
                easing: 'easeOutQuart'
            });
        });
        
        card.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                scale: 1,
                duration: 300,
                easing: 'easeOutQuart'
            });
        });
        
        card.addEventListener('click', function() {
            // 添加点击震动效果
            anime({
                targets: this,
                translateX: [0, -10, 10, -5, 5, 0],
                duration: 500,
                easing: 'easeOutQuart'
            });
        });
    });
}

// 标题切割效果
function initCuttingEffect() {
    const cuttingElements = document.querySelectorAll('.cutting-effect');
    
    cuttingElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            anime({
                targets: this.querySelector('::before'),
                left: ['-100%', '100%'],
                duration: 1000,
                easing: 'easeInOutQuart'
            });
        });
    });
}

// 心电图脉冲效果
function initHeartbeatEffect() {
    const heartbeatElements = document.querySelectorAll('.heartbeat');
    
    heartbeatElements.forEach(element => {
        anime({
            targets: element,
            scale: [1, 1.1, 1],
            duration: 1000,
            easing: 'easeInOutQuart',
            loop: true
        });
    });
}

// 警告边框脉冲效果
function initWarningBorderEffect() {
    const warningBorders = document.querySelectorAll('.warning-border');
    
    warningBorders.forEach(border => {
        anime({
            targets: border,
            borderColor: ['#8B0000', '#FF0000', '#8B0000'],
            duration: 2000,
            easing: 'easeInOutQuart',
            loop: true
        });
    });
}

// 滚动进度指示器
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 4px;
        background: linear-gradient(90deg, #8B0000, #FF0000);
        z-index: 9999;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    initScrollProgress();
    initHeartbeatEffect();
    initWarningBorderEffect();
    initCuttingEffect();
    
    // 添加页面加载动画
    anime({
        targets: 'body',
        opacity: [0, 1],
        duration: 1000,
        easing: 'easeOutQuart'
    });
});

// 导航栏滚动效果
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 100) {
        nav.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        nav.style.backdropFilter = 'blur(10px)';
    } else {
        nav.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        nav.style.backdropFilter = 'blur(5px)';
    }
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 添加键盘导航支持
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// 错误处理
window.addEventListener('error', function(e) {
    console.error('JavaScript错误:', e.error);
});

// 性能监控
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('页面加载时间:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}