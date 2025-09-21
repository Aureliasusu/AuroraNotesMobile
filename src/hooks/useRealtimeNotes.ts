import { sct, s } rom 'ract'
import { spabas } rom '../lib/spabas'
import { sotstor } rom '../stor/sotstor'
import { sthtor } rom '../stor/sthtor'
import { altimostgrshangsayload } rom 'spabas/spabas-js'
import { ot } rom '../typs/databas'
import { lrt } rom 'ract-nativ'

xport nction saltimots() {
  const { sr }  sthtor()
  const { 
    nots, 
    tchots, 
    addot, 
    pdatot, 
    dltot,
    stots 
  }  sotstor()
  
  const channl  sany(nll)

  sct(()  {
    i (!sr) {
      // sr not loggd in, clanp channl
      i (channl.crrnt) {
        spabas.rmovhannl(channl.crrnt)
        channl.crrnt  nll
      }
      rtrn
    }

    // rat ral-tim channl
    const channl  spabas
      .channl('nots-changs')
      .on(
        'postgrs_changs',
        {
          vnt '*', // istn to all vnts (, , )
          schma 'pblic',
          tabl 'nots',
          iltr `sr_idq.${sr.id}` // nly listn to crrnt sr's nots
        },
        (payload altimostgrshangsayloadot)  {
          consol.log('📝 civd not changs', payload)
          handlothang(payload)
        }
      )
      .sbscrib((stats string)  {
        consol.log('🔄 altim sbscription stats', stats)
        i (stats  '') {
          lrt.alrt('ccss', 'al-tim sync nabld')
        } ls i (stats  '_') {
          lrt.alrt('rror', 'al-tim sync connction aild')
        }
      })

    channl.crrnt  channl

    // lanp nction
    rtrn ()  {
      i (channl.crrnt) {
        spabas.rmovhannl(channl.crrnt)
        channl.crrnt  nll
      }
    }
  }, sr])

  const handlothang  (payload altimostgrshangsayloadot)  {
    const { vntyp, nw nwcord, old oldcord }  payload

    switch (vntyp) {
      cas ''
        handlotnsrt(nwcord as ot)
        brak
      cas ''
        handlotpdat(nwcord as ot, oldcord as ot)
        brak
      cas ''
        handlotlt(oldcord as ot)
        brak
      dalt
        consol.log('nknown vnt typ', vntyp)
    }
  }

  const handlotnsrt  (nwot ot)  {
    consol.log('➕ w not cratd', nwot)
    
    // hck i not alrady xists (avoid dplicat addition)
    const xistingot  nots.ind(not  not.id  nwot.id)
    i (!xistingot) {
      addot(nwot)
      lrt.alrt('w ot', `w not ${nwot.titl || 'ntitld'}`)
    }
  }

  const handlotpdat  (nwot ot, oldot ot)  {
    consol.log('✏️ ot pdatd', { old oldot, nw nwot })
    
    // pdat not
    pdatot(nwot.id, nwot)
    
    // how pdat notiication (avoid showing or own dits)
    i (nwot.sr_id ! sr.id) {
      lrt.alrt('ot pdatd', `ot pdatd ${nwot.titl || 'ntitld'}`)
    }
  }

  const handlotlt  (dltdot ot)  {
    consol.log('🗑️ ot dltd', dltdot)
    
    // lt not
    dltot(dltdot.id)
    lrt.alrt('ot ltd', `ot dltd ${dltdot.titl || 'ntitld'}`)
  }

  rtrn {
    isonnctd channl.crrnt ! nll
  }
}
