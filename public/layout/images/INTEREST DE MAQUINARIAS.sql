USE INBROKER
GO
SELECT 
  [SG].CodPoliza,
  IG1.*,
  IM.*,
  IM.GuidStamp as GuidStampEsp,
  'S' AS SnProrroga,
  XX.*,
  [SG].*
 
FROM  
  Sg_ItemGeneral IG1 
	INNER JOIN   Sg_ItemMaquinaria AS IM ON IM.IdMovItem = Ig1.IdMovItem
    LEFT OUTER JOIN Sg_DetalleItemCobertura DI on DI.IdMovItem=IM.IdMovItem
    LEFT OUTER JOIN  Sg_TipoDetalleItemCobertura TDI ON TDI.CodTipoDetalleItemCobertura=DI.CodTipoDetalleItemCob
	CROSS APPLY (
		SELECT [O].[CodPoliza] FROM [Inbroker].[dbo].[Sg_Operacion] AS O
		WHERE O.IdOperacion = IG1.IdOperacion AND  O.ESTADO <>'B'
	) AS [CODSG]
	INNER JOIN [DASI].[PC].[Policy] AS [P] ON LTRIM(RTRIM(P.PolicyCode)) =  LTRIM(RTRIM(CODSG.CodPoliza))
	INNER JOIN [DASI].[PC].[SubTrade] AS [ST] ON [ST].[SubTrade_ID] = [P].[SubTrade_ID]
	INNER JOIN [DASI].[PC].[Trade] AS [T] ON [T].[Trade_ID] =  [ST].[Trade_ID]
    OUTER APPLY (
			SELECT TOP 1 
				[SO].IdOperacion,
				[SO].IdPoliza,
				[SO].IdCertificado 
			from Inbroker.dbo.Sg_Operacion as [SO]
			WHERE [SO].CodPoliza=[CODSG].CodPoliza  AND  [SO].ESTADO <> 'B'
			order by [SO].IdOperacion desc, 
					 [SO].IdPoliza desc, 
					 [SO].IdCertificado desc
   ) AS [XX]
  LEFT JOIN SG_OPERACION as [SG] ON [SG].[IdOperacion] = [XX].[IdOperacion]
 
WHERE
  --IG1.IdMovItem = IM.IdMovItem AND
  
   IG1.IdOperacion <= XX.IdOperacion
  AND IG1.IdPoliza =  [XX].[IdPoliza]
  AND IG1.IdCertificado = XX.IdCertificado 
  AND IG1.Estado <> 'B' 
 -- AND CODSG.CodPoliza= '2-2-812-0012857' --'2-2-809-0043013' 

  --AND  RIGHT('00'+CONVERT(VARCHAR,[T].[Trade_ID]),2) + RIGHT('00'+CONVERT(VARCHAR,[ST].[SubTradeSecuence]),2) IN ('0911','0605')
 order by NroItem asc