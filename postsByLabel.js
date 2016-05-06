/* 
    Created on : Apr 28, 2016, 3:19:45 AM
    Author     : Shubham
    Website : http://mycodingtricks.com/
*/
(function($){
    $.fn.postsByLabel = function(options){
        var settings = $.extend({
            url: null,
            label: null,
            orderby: "published",
            postCount: 5,
            textLength: 150,
            loading: "Loading...",
            defaultThumbnail: "http://4.bp.blogspot.com/-HALLtgFeep0/VfryhQ0C5oI/AAAAAAAAPcY/77mSGND4q84/s200/Icon.png"
        },options);
        if(settings.url===null || settings.label===null){
            console.log("Please Configure the Plugin Corretly");
            return this;
        }
        return this.each(function(){
            var self = $(this),
            id = randomInt();
            self.html("<div id='postsByLabel-"+id+"' class='postsByLabel'></div>");
            var postsByLabel = $("#postsByLabel-"+id);
            postsByLabel.html("<span class='postsByLabel-loading'>"+settings.loading+"</span>");
            var feedUrl = settings.url+"/feeds/posts/summary/-/"+settings.label+"?orderby="+settings.orderby+"&alt=json-in-script&max-results="+settings.postCount+"&callback=?";
            //var feedUrl = "posts.json";
            $.getJSON(feedUrl,function(data){
                var posts = data.feed.entry;
                postsByLabel.html("");
                $.each(posts,function(i,post){
                    var title = post.title.$t,
                        href = post.link[post.link.length-1].href,
                        author = post.author[0].name.$t,
                        authorUrl = post.author[0].uri.$t,
                        published = formatDate(post.published.$t),
                        updated = formatDate(post.updated.$t),
                        comments = post.thr$total.$t,
                        content = trimText(post.summary.$t,settings.textLength),
                        categories = categoriesWithLinks(post.category);
                        
                    var thumbnail = getThumbnail(post,settings.defaultThumbnail);
                        var code = "<div class='postByLabel-post'>"+
                                "<div class='postByLabel-post-inner'>"+
                                "<a href='"+href+"'><img src='"+thumbnail+"' width='72px' height='72px'/></a>"+
                                "<div class='postByLabel-post-title-shadow'></div><a class='postByLabel-post-title' href='"+href+"'>"+title+"</a>"+
                                "<p class='postByLabel-post-excerpt'>"+content+"...</p>"+
                                "</div>"+
                                "<div class='postByLabel-post-extra'>"+
                                "<ul>"+
                                "<li><i class='fa fa-user'></i><a href='"+authorUrl+"' rel='author' target=_blank>"+author+"</a></li>"+
                                "<li><i class='fa fa-tags'></i>"+categories+"</li>"+
                                "<li><a href='"+href+"/#comment-form' target=_blank><i class='fa fa-comments'></i>"+comments+"</a></li>"+
                                "<li><i class='fa fa-clock-o'></i>"+published.dd+"/"+published.mm+"/"+published.yyyy+"</li>"+
                                "<li title='"+updated.dd+"/"+updated.mm+"/"+updated.yyyy+" @ "+updated.hour+":"+updated.minute+":"+updated.second+" "+updated.ampm+"'><i class='fa fa-pencil-square'></i> Edited</li>"+
                                "</ul>"+
                                "</div>"+
                                "</div>";
                        postsByLabel.append(code);
                });
            });
        });
        function categoriesWithLinks(cats){
            var newCat = [];
            for(var i=0;i<((cats.length>2)?2:cats.length);i++){
                newCat.push("<"+"a href='"+settings.url+"/search/label/"+cats[i].term+"' target=_blank>"+cats[i].term+"<"+"/a>");
            }
            return newCat.join(", ");
        }
        function getThumbnail(post,noThumbnail){
            if(typeof(post.media$thumbnail)!== "undefined") if(typeof(post.media$thumbnail.url)!=="undefined" && post.media$thumbnail.url!="") return post.media$thumbnail.url.replace("/s72-c/","/s400/");
            return noThumbnail;
        }
        function trimText(text,length){
            return text.replace(new RegExp("^(.{"+length+"}[^\\s]*).*"),"$1");
        }
        function formatDate(d){
            var date = new Date(d);
            var dd = date.getDate(); 
            var mm = date.getMonth()+1;
            var yyyy = date.getFullYear(); 
            var hour = date.getHours();
            var minute = date.getMinutes();
            var second = date.getSeconds();
            var ampm = "AM";
            if(dd<10){dd='0'+dd;} 
            if(mm<10){mm='0'+mm;};
            if(hour>12){hour-=12;ampm="PM";}
            var data = {
                dd: dd,
                mm: mm,
                yyyy: yyyy,
                hour: hour,
                minute: minute,
                second: second,
                ampm: ampm
            };
            return data;
        }
        function randomInt(){
            return Math.floor(Math.random()*100)+1;
        }
    };
})(jQuery);
