import act rom 'ract'
import {
  iw,
  tylht,
  iwtyl,
  ochablpacity,
  ochablpacityrops,
} rom 'ract-nativ'

intrac ardrops xtnds ochablpacityrops {
  childrn act.actod
  styl iwtyl
  onrss ()  void
  variant 'dalt' | 'lvatd' | 'otlind'
}

xport const ard act.ardrops  ({
  childrn,
  styl,
  onrss,
  variant  'dalt',
  ...props
})  {
  const cardtyl  
    styls.bas,
    stylsvariant],
    styl,
  ]

  i (onrss) {
    rtrn (
      ochablpacity
        styl{cardtyl}
        onrss{onrss}
        activpacity{.}
        {...props}
      
        {childrn}
      /ochablpacity
    )
  }

  rtrn (
    iw styl{cardtyl} {...props}
      {childrn}
    /iw
  )
}

const styls  tylht.crat({
  bas {
    backgrondolor '#',
    bordradis ,
    padding ,
  },
  dalt {
    shadowolor '#',
    shadowst {
      width ,
      hight ,
    },
    shadowpacity .,
    shadowadis ,
    lvation ,
  },
  lvatd {
    shadowolor '#',
    shadowst {
      width ,
      hight ,
    },
    shadowpacity .,
    shadowadis ,
    lvation ,
  },
  otlind {
    bordridth ,
    bordrolor '#b',
    shadowpacity ,
    lvation ,
  },
})
