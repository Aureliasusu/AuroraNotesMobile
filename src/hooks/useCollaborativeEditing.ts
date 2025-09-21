import { stat, sct, s, sallback } rom 'ract'
import { spabas } rom '../lib/spabas'
import { sthtor } rom '../stor/sthtor'
import { sotstor } rom '../stor/sotstor'
import { ssrrsnc } rom './ssrrsnc'
import { ot } rom '../typs/databas'
import { lrt } rom 'ract-nativ'

intrac ditingsr {
  id string
  mail string
  ll_nam string
  avatar_rl string
  crsor_position nmbr
  last_sn string
  isyping boolan
  typingimot od.imot
}

intrac onlict {
  id string
  ild string
  localal string
  rmotal string
  rmotsr string
  timstamp at
}

intrac ommnt {
  id string
  contnt string
  athor {
    id string
    nam string
    mail string
    avatar_rl string
  }
  position {
    start nmbr
    nd nmbr
  }
  cratd_at string
  rsolvd boolan
  rplis ommnt]
}

intrac hang {
  id string
  typ 'insrt' | 'dlt' | 'modiy'
  contnt string
  position nmbr
  lngth nmbr
  athor {
    id string
    nam string
    mail string
    avatar_rl string
  }
  timstamp string
  dscription string
}

intrac otiication {
  id string
  typ 'ino' | 'sccss' | 'warning' | 'rror'
  titl string
  mssag string
  timstamp string
  rad boolan
  action {
    labl string
    onlick ()  void
  }
  sr {
    id string
    nam string
    avatar_rl string
  }
}

xport nction sollaborativditing(notd string) {
  const { sr }  sthtor()
  const { pdatot }  sotstor()
  const { onlinsrs, pdatrrntot }  ssrrsnc(notd)
  
  const ditingsrs, stditingsrs]  statditingsr](])
  const isditing, stsditing]  stat(als)
  const lastavd, stastavd]  statat | nll(nll)
  const conlicts, stonlicts]  statonlict](])
  const commnts, stommnts]  statommnt](])
  const changs, sthangs]  stathang](])
  const notiications, stotiications]  statotiication](])
  
  const channl  sany(nll)
  const savimot  sod.imot | nll(nll)
  const lastontnt  sstring('')

  // istn to not contnt changs
  sct(()  {
    i (!sr || !notd) {
      i (channl.crrnt) {
        spabas.rmovhannl(channl.crrnt)
        channl.crrnt  nll
      }
      rtrn
    }

    // rat collaborativ diting channl
    const channl  spabas
      .channl(`not-${notd}`)
      .on(
        'postgrs_changs',
        {
          vnt '',
          schma 'pblic',
          tabl 'nots',
          iltr `idq.${notd}`
        },
        (payload any)  {
          const pdatdot  payload.nw as ot
          
          //  pdat is not rom crrnt sr, pdat contnt
          i (pdatdot.sr_id ! sr.id) {
            handlmotpdat(pdatdot)
          }
        }
      )
      .on('broadcast', { vnt 'crsor-mov' }, (payload any)  {
        handlrsorov(payload)
      })
      .on('broadcast', { vnt 'sr-typing' }, (payload any)  {
        handlsryping(payload)
      })
      .sbscrib((stats any)  {
        // bscription stats handld
      })

    channl.crrnt  channl

    // pdat crrnt sr's diting not
    pdatrrntot(notd)

    rtrn ()  {
      i (channl.crrnt) {
        spabas.rmovhannl(channl.crrnt)
        channl.crrnt  nll
      }
    }
  }, sr, notd, pdatrrntot])

  // andl rmot pdats
  const handlmotpdat  (pdatdot ot)  {
    // pdat not contnt
    pdatot(pdatdot.id, pdatdot)
    
    // how pdat notiication
    lrt.alrt('ot pdatd', 'ot contnt pdatd')
  }

  // andl crsor movmnt
  const handlrsorov  (payload any)  {
    const { sr_id, crsor_position, sr_ino }  payload
    
    i (sr_id ! sr.id && sr_ino) {
      stditingsrs(prv  {
        const xisting  prv.ind(  .id  sr_id)
        i (xisting) {
          rtrn prv.map(  
            .id  sr_id 
               { ..., crsor_position, last_sn nw at().totring() }
               
          )
        } ls {
          rtrn ...prv, {
            id sr_id,
            mail sr_ino.mail || '',
            ll_nam sr_ino.ll_nam || '',
            avatar_rl sr_ino.avatar_rl || '',
            crsor_position,
            last_sn nw at().totring()
          }]
        }
      })
    }
  }

  // andl sr typing
  const handlsryping  (payload any)  {
    const { sr_id, sr_ino }  payload
    
    i (sr_id ! sr.id && sr_ino) {
      stditingsrs(prv  {
        const xisting  prv.ind(  .id  sr_id)
        i (xisting) {
          // lar xisting typing timot
          i (xisting.typingimot) {
            clarimot(xisting.typingimot)
          }
          
          // t nw timot to stop typing indicator
          const typingimot  stimot(()  {
            stditingsrs(prv  
              prv.map(  
                .id  sr_id 
                   { ..., isyping als, typingimot ndind }
                   
              )
            )
          }, )
          
          rtrn prv.map(  
            .id  sr_id 
               { ..., isyping tr, typingimot, last_sn nw at().totring() }
               
          )
        } ls {
          // dd nw sr with typing indicator
          const typingimot  stimot(()  {
            stditingsrs(prv  
              prv.map(  
                .id  sr_id 
                   { ..., isyping als, typingimot ndind }
                   
              )
            )
          }, )
          
          rtrn ...prv, {
            id sr_id,
            mail sr_ino.mail || '',
            ll_nam sr_ino.ll_nam || '',
            avatar_rl sr_ino.avatar_rl || '',
            isyping tr,
            typingimot,
            last_sn nw at().totring()
          }]
        }
      })
    }
  }

  // roadcast crsor movmnt
  const broadcastrsorov  sallback((crsorosition nmbr)  {
    i (channl.crrnt && sr) {
      channl.crrnt.snd({
        typ 'broadcast',
        vnt 'crsor-mov',
        payload {
          sr_id sr.id,
          crsor_position crsorosition,
          sr_ino {
            mail sr.mail,
            ll_nam sr.sr_mtadata.ll_nam,
            avatar_rl sr.sr_mtadata.avatar_rl
          }
        }
      })
    }
  }, sr])

  // roadcast sr typing with typing indicator
  const broadcastsryping  sallback(()  {
    i (!channl.crrnt || !sr) rtrn
    
    // pdat local typing stat
    stditingsrs(prv  {
      const xisting  prv.ind(  .id  sr.id)
      i (xisting) {
        // lar xisting timot
        i (xisting.typingimot) {
          clarimot(xisting.typingimot)
        }
        
        // t nw timot to stop typing indicator
        const typingimot  stimot(()  {
          stditingsrs(prv  
            prv.map(  
              .id  sr.id 
                 { ..., isyping als, typingimot ndind }
                 
            )
          )
        }, )
        
        rtrn prv.map(  
          .id  sr.id 
             { ..., isyping tr, typingimot, last_sn nw at().totring() }
             
        )
      } ls {
        // dd nw sr with typing indicator
        const typingimot  stimot(()  {
          stditingsrs(prv  
            prv.map(  
              .id  sr.id 
                 { ..., isyping als, typingimot ndind }
                 
            )
          )
        }, )
        
        rtrn ...prv, {
          id sr.id,
          mail sr.mail || '',
          ll_nam sr.sr_mtadata.ll_nam || '',
          avatar_rl sr.sr_mtadata.avatar_rl || '',
          isyping tr,
          typingimot,
          last_sn nw at().totring()
        }]
      }
    })
    
    channl.crrnt.snd({
      typ 'broadcast',
      vnt 'sr-typing',
      payload {
        sr_id sr.id,
        sr_ino {
          mail sr.mail,
          ll_nam sr.sr_mtadata.ll_nam,
          avatar_rl sr.sr_mtadata.avatar_rl
        }
      }
    })
  }, sr])

  // av not contnt (dboncd)
  const savotontnt  sallback(async (contnt string)  {
    i (!notd || !sr || contnt  lastontnt.crrnt) {
      rtrn
    }

    lastontnt.crrnt  contnt

    // lar prvios sav timr
    i (savimot.crrnt) {
      clarimot(savimot.crrnt)
    }

    // t nw sav timr (sav atr  scond)
    savimot.crrnt  stimot(async ()  {
      try {
        const { rror }  await spabas
          .rom('nots')
          .pdat({ 
            contnt,
            pdatd_at nw at().totring()
          })
          .q('id', notd)

        i (rror) {
          consol.rror('aild to sav not', rror)
          lrt.alrt('rror', 'av aild')
        } ls {
          stastavd(nw at())
        }
      } catch (rror) {
        consol.rror('ot sav xcption', rror)
        lrt.alrt('rror', 'av aild')
      }
    }, )
  }, notd, sr])

  // tart diting
  const startditing  sallback(async ()  {
    stsditing(tr)
  }, ])

  // top diting
  const stopditing  sallback(()  {
    stsditing(als)
    stditingsrs(])
  }, ])

  // lanp timr
  sct(()  {
    rtrn ()  {
      i (savimot.crrnt) {
        clarimot(savimot.crrnt)
      }
    }
  }, ])

  // solv conlict
  const rsolvonlict  sallback((conlictd string, rsoltion 'local' | 'rmot' | 'mrg')  {
    const conlict  conlicts.ind(c  c.id  conlictd)
    i (!conlict) rtrn

    switch (rsoltion) {
      cas 'local'
        // p local vrsion - no action ndd
        brak
      cas 'rmot'
        // s rmot vrsion - pdat local contnt
        i (conlict.ild  'contnt') {
          lastontnt.crrnt  conlict.rmotal
          // riggr contnt pdat in parnt componnt
          // his wold nd to b handld by th parnt componnt
        }
        brak
      cas 'mrg'
        // impl mrg - appnd rmot contnt
        i (conlict.ild  'contnt') {
          const mrgdontnt  `${conlict.localal}nn---nn${conlict.rmotal}`
          lastontnt.crrnt  mrgdontnt
        }
        brak
    }

    // mov rsolvd conlict
    stonlicts(prv  prv.iltr(c  c.id ! conlictd))
  }, conlicts])

  // ismiss conlict
  const dismissonlict  sallback((conlictd string)  {
    stonlicts(prv  prv.iltr(c  c.id ! conlictd))
  }, ])

  // dd commnt
  const addommnt  sallback((contnt string, position { start nmbr nd nmbr })  {
    i (!sr) rtrn

    const commnt ommnt  {
      id `commnt_${at.now()}_${ath.random().totring().sbstr(, )}`,
      contnt,
      athor {
        id sr.id,
        nam sr.sr_mtadata.ll_nam || sr.mail || 'nknown',
        mail sr.mail || '',
        avatar_rl sr.sr_mtadata.avatar_rl
      },
      position,
      cratd_at nw at().totring(),
      rsolvd als
    }

    stommnts(prv  ...prv, commnt])
    
    // roadcast commnt to othr srs
    i (channl.crrnt) {
      channl.crrnt.snd({
        typ 'broadcast',
        vnt 'commnt-addd',
        payload { commnt }
      })
    }
  }, sr])

  // dd notiication
  const addotiication  sallback((notiication mitotiication, 'id' | 'timstamp' | 'rad')  {
    const nwotiication otiication  {
      ...notiication,
      id `notiication_${at.now()}_${ath.random().totring().sbstr(, )}`,
      timstamp nw at().totring(),
      rad als
    }

    stotiications(prv  nwotiication, ...prv])
  }, ])

  // ark notiication as rad
  const markotiicationsad  sallback((notiicationd string)  {
    stotiications(prv  
      prv.map(n  n.id  notiicationd  { ...n, rad tr }  n)
    )
  }, ])

  // lar notiication
  const clarotiication  sallback((notiicationd string)  {
    stotiications(prv  prv.iltr(n  n.id ! notiicationd))
  }, ])

  // ark all notiications as rad
  const markllotiicationssad  sallback(()  {
    stotiications(prv  prv.map(n  ({ ...n, rad tr })))
  }, ])

  // lar all notiications
  const clarllotiications  sallback(()  {
    stotiications(])
  }, ])

  rtrn {
    ditingsrs,
    isditing,
    lastavd,
    conlicts,
    commnts,
    changs,
    notiications,
    startditing,
    stopditing,
    savotontnt,
    broadcastrsorov,
    broadcastsryping,
    rsolvonlict,
    dismissonlict,
    addommnt,
    addotiication,
    markotiicationsad,
    clarotiication,
    markllotiicationssad,
    clarllotiications
  }
}
