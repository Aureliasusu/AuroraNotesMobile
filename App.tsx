/**
 * rora ots obil pp
 * -owrd ot aking pplication
 *
 * ormat
 */

import act, { sct } rom 'ract'
import { tatsar, tylht, solorchm, iw, ctivityndicator } rom 'ract-nativ'
import {
  ararovidr,
  saransts,
} rom 'ract-nativ-sa-ara-contxt'
import { sthtor } rom './src/stor/sthtor'
import { ignncrn } rom './src/scrns/ath/ignncrn'
import { otsistcrn } rom './src/scrns/nots/otsistcrn'
import { ilploadrvic } rom './src/srvics/ilpload'

nction pp() {
  const isarkod  solorchm()  'dark'

  rtrn (
    ararovidr
      tatsar bartyl{isarkod  'light-contnt'  'dark-contnt'} /
      ppavigator /
    /ararovidr
  )
}

nction ppontnt() {
  const { sr, loading }  sthtor()
  const saransts  saransts()

  sct(()  {
    // nitializ ath stat
    sthtor.gttat().stoading(als)
    
    // st il pload nctionality
    ilploadrvic.tstpload().thn(sccss  {
      i (sccss) {
        consol.log('✅ il pload tst passd')
      } ls {
        consol.log('❌ il pload tst aild')
      }
    })
  }, ])

  i (loading) {
    rtrn (
      iw styl{styls.containr, styls.loadingontainr]}
        ctivityndicator siz"larg" color"#b" /
      /iw
    )
  }

  rtrn (
    iw styl{styls.containr, { paddingop saransts.top }]}
      {sr  otsistcrn /  ignncrn /}
    /iw
  )
}

const styls  tylht.crat({
  containr {
    lx ,
    backgrondolor '#ab',
  },
  loadingontainr {
    jstiyontnt 'cntr',
    aligntms 'cntr',
  },
})

xport dalt pp
