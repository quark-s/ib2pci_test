
$(window).load(function()
{
	//from scoring.xml file
	var attr = getScoringAttributes();
	var mode = attr.mode;
	var source = attr.source;

	if ((typeof(ModuleId)=='undefined') || ((typeof(ModuleId)!='undefined') && (source == ModuleId)))
	{
		switch(mode)
		{
			case 'multihighlight':
			case 'highlight':
			{
				useMultiHighlight();//starts the highlight functions, get/set context and scoring
				break;
			}
			case 'click':
			{
				useSelection();// get/set context and scoring
				break;
			}
			case 'link':
			{
				//the webbrowser saves and restore its own context
				uselinks();
				break;
			}
			case 'form':
			{
				//uses raynald's parser to score
				useForms();
				break;
			}
			case 'dragdrop':
			{
				useDragDrop();
				break;
			}
			case 'order':
			{
				useOrder();
				break;
			}
            case 'fte':
            {
                    //extracts constructed response data for later scoring
                    useFTE();
                    break;
            }
			case 'ps':
			case 'problemsolving':
			{
				useProblemSolvingScoring();
				break;
			}
			case 'none':
			{
				break;
			}
			default:
			{
				console.log('unknown scoring mode : ', mode);
			}
		}
	}
});