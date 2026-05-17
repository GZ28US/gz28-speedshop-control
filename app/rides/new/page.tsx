useEffect(() => {
  async function loadNextProjectCode() {
    const { data } = await supabase
      .from('rides')
      .select('project_code')

    const usedNumbers =
      data?.map((item) => {
        const match = item.project_code?.match(/US\.(\d+)/)

        return match ? Number(match[1]) : null
      }) || []

    let nextNumber = 1

    while (usedNumbers.includes(nextNumber)) {
      nextNumber++
    }

    setProjectCode(
      `US.${String(nextNumber).padStart(3, '0')}`
    )
  }

  loadNextProjectCode()
}, [])