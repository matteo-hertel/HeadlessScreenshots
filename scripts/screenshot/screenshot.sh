WEBSITE=$1;


if [ -z "$WEBSITE" ] ; then
    echo "please provide a website e.g. https://example.com"
    exit
fi

DIMENSIONS=(
#Apple iPhone 6
750px*1334px
#Apple iPhone 5
640px*1136px
#LG G4
1440px*2560px
#Samsung Galaxy Note 2
720px*1280px
#Microsoft Lumia 1020
768px*1280px
#HTC One
1080px*1920px
#Apple iPad Pro
2048px*2732px
#Apple iPad 3, 4, Air
1536px*2048px
#Samsung Galaxy Tab 3 10"
800px*1280px
);

FILE=$WEBSITE
FILE=${FILE#*//} #removes stuff upto // from begining
FILE=${FILE%/*} #removes stuff from / all the way to end
FILENAME=""
for i in "${DIMENSIONS[@]}"
do
   :
    FILENAME=$(echo $i | sed "s/\*//")

    phantomjs ./handlers/screenshot.js $WEBSITE ./output/phantom/$FILE/$FILENAME.png $i
    echo  $FILE/$FILENAME.png
done
