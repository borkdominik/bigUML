package com.eclipsesource.uml.modelserver.commands.activitydiagram.notation.activity;

import com.eclipsesource.uml.modelserver.commands.commons.notation.UmlNotationElementCommand;
import com.eclipsesource.uml.modelserver.commands.commons.util.UmlNotationCommandUtil;
import com.eclipsesource.uml.modelserver.unotation.NotationElement;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;

public class RemoveActivityShapeCommand extends UmlNotationElementCommand {

    protected final NotationElement shapeToRemove;

    public RemoveActivityShapeCommand(final EditingDomain domain, final URI modelUri, final String semanticProxyUri) {
        super(domain, modelUri);
        shapeToRemove = UmlNotationCommandUtil.getNotationElement(modelUri, domain, semanticProxyUri);
    }

    @Override
    protected void doExecute(){
        if (shapeToRemove != null){
            umlDiagram.getElements().remove(shapeToRemove);
        }
    }

}
