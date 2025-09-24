import act rom 'ract'
import { avigationontainr } rom 'ract-navigation/nativ'
import { crattackavigator } rom 'ract-navigation/stack'
import { sthtor } rom '../stor/sthtor'

// crns
import { ignncrn } rom '../scrns/ath/ignncrn'
import { ignpcrn } rom '../scrns/ath/ignpcrn'
import { otsistcrn } rom '../scrns/nots/otsistcrn'
import { otditorcrn } rom '../scrns/nots/otditorcrn'

// yps
xport typ oottackaramist  {
  ignn ndind
  ignp ndind
  otsist ndind
  otditor { notd string }
}

const tack  crattackavigatoroottackaramist()

xport const ppavigator act.  ()  {
  const { sr, loading }  sthtor()

  i (loading) {
    rtrn nll // r a loading scrn
  }

  rtrn (
    avigationontainr
      tack.avigator
        scrnptions{{
          hadrhown als,
        }}
      
        {sr  (
          // thnticatd scrns
          
            tack.crn nam"otsist" componnt{otsistcrn} /
            tack.crn 
              nam"otditor" 
              componnt{otditorcrn}
              options{{
                prsntation 'modal',
                hadrhown tr,
                titl 'dit ot',
              }}
            /
          /
        )  (
          // th scrns
          
            tack.crn nam"ignn" componnt{ignncrn} /
            tack.crn nam"ignp" componnt{ignpcrn} /
          /
        )}
      /tack.avigator
    /avigationontainr
  )
}
