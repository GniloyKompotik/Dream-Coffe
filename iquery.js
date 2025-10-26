$(document).ready(function(){
  console.log("jQuery is ready!");
  const suggestionsData = ["Classic Espresso","Velvet Cappuccino","Chill Cold Brew","Caramel Latte","Cold brew vs. iced coffee","How we roast our beans","Caffeine: myths and facts","House Blend","Vanilla Shot"];

  function showToast(text,timeout=3000){
    const id = 't'+Date.now();
    const $t = $('<div class="toast-notif" id="'+id+'">'+text+'</div>');
    $('#toast-container').append($t);
    $t.hide().fadeIn(200);
    setTimeout(()=>{$t.fadeOut(400,function(){$t.remove();});},timeout);
  }

  function updateProgress(){
    const s = $(window).scrollTop();
    const h = $(document).height() - $(window).height();
    const pct = h>0?Math.round((s/h)*100):0;
    $('#scroll-progress').css('width', pct+'%');
  }
  $(window).on('scroll resize', updateProgress);
  updateProgress();

  $('.counter').each(function(){
    const $el = $(this);
    const target = parseInt($el.attr('data-target'),10) || 0;
    let current = 0;
    const step = Math.max(1, Math.floor(target / 120));
    const id = setInterval(()=>{
      current += step;
      if(current >= target){current = target; clearInterval(id);}
      $el.text(current);
    },12);
  });

  const $input = $('#search-input');
  const $suggest = $('#suggestions');
  function renderSuggestions(list){
    if(!list.length){$suggest.addClass('d-none'); return;}
    $suggest.empty();
    for(const s of list){
      const $li = $('<li class="list-group-item list-group-item-action"></li>');
      $li.text(s);
      $suggest.append($li);
    }
    $suggest.removeClass('d-none');
  }

  $input.on('keyup', function(e){
    const q = $(this).val().trim().toLowerCase();
    if(!q){$('.item-card').show(); removeHighlights(); renderSuggestions([]); return;}
    const filteredSuggestions = suggestionsData.filter(x=>x.toLowerCase().includes(q)).slice(0,7);
    renderSuggestions(filteredSuggestions);

    $('.item-card').each(function(){
      const title = $(this).find('.card-title').text().toLowerCase();
      const desc = $(this).find('.card-text').text().toLowerCase();
      if(title.includes(q) || desc.includes(q)) $(this).show(); else $(this).hide();
    });

    highlightMatches(q);
  });

  $('#suggestions').on('click','li', function(){
    const val = $(this).text();
    $input.val(val).trigger('keyup');
    $suggest.addClass('d-none');
  });

  $('#search-clear').on('click', function(){
    $('#search-input').val('').trigger('keyup');
    $suggest.addClass('d-none');
  });

  function escapeRegex(s){ return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');}
  function removeHighlights(){
    $('.highlightable').each(function(){
      const html = $(this).text();
      $(this).html(html);
    });
  }
  function highlightMatches(q){
    if(!q){removeHighlights(); return;}
    const re = new RegExp('('+escapeRegex(q)+')','ig');
    $('.highlightable').each(function(){
      const txt = $(this).text();
      const newHtml = txt.replace(re,'<span class="match">$1</span>');
      $(this).html(newHtml);
    });
  }

  $(document).on('click', function(e){
    if(!$(e.target).closest('#suggestions, #search-input').length) $('#suggestions').addClass('d-none');
  });

  $('.add-cart').on('click', function(){
    showToast('Item added to cart');
  });

  $(document).on('click', '.copy-btn', function(){
    const $btn = $(this);
    const text = $btn.attr('data-text') || $btn.closest('.card-body').find('.card-title').text();
    navigator.clipboard.writeText(text).then(()=>{
      const orig = $btn.html();
      $btn.html('✔ Copied');
      setTimeout(()=>{$btn.html(orig);},1400);
      showToast('Copied to clipboard');
    }).catch(()=>{ showToast('Copy failed'); });
  });

  $('#subscribe-form').on('submit', function(e){
    e.preventDefault();
    const $btn = $('#subscribe-btn');
    $btn.prop('disabled',true);
    const orig = $btn.html();
    $btn.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Please wait...');
    setTimeout(()=>{
      $btn.prop('disabled',false);
      $btn.html(orig);
      $('#email').val('');
      showToast('Subscription successful');
    },1600);
  });

  function lazyLoad(){
    const lazy = $('.lazy');
    if('IntersectionObserver' in window){
      const obs = new IntersectionObserver((entries,observer)=>{
        entries.forEach(entry=>{
          if(entry.isIntersecting){
            const el = entry.target;
            const $el = $(el);
            const src = $el.attr('data-src');
            if(src){$el.attr('src',src); $el.removeAttr('data-src');}
            observer.unobserve(el);
          }
        });
      },{rootMargin:'100px'});
      lazy.each(function(){ if(this.getAttribute('data-src')) obs.observe(this); });
    } else {
      function onScroll(){
        lazy.each(function(){
          const $el = $(this);
          if(!$el.attr('data-src')) return;
          const top = $el.offset().top;
          const scroll = $(window).scrollTop() + $(window).height() + 100;
          if(scroll > top){
            $el.attr('src',$el.attr('data-src'));
            $el.removeAttr('data-src');
          }
        });
      }
      $(window).on('scroll resize', onScroll);
      onScroll();
    }
  }
  lazyLoad();

  $(window).on('load', function(){
    updateProgress();
  });
});
