package com.eclipsesource.uml.modelserver.commands.usecasediagram.usecasepackage;

import com.eclipsesource.uml.modelserver.commands.commons.notation.UmlNotationElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlNotationCommandUtil;
import org.eclipse.glsp.server.emf.model.notation.Shape;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;

public class RemovePackageShapeCommand extends UmlNotationElementCommand {

    protected final Shape packageToRemove;

    public RemovePackageShapeCommand(final EditingDomain domain, final URI modelUri, final String semanticProxyUri) {
        super(domain, modelUri);
        this.packageToRemove = UmlNotationCommandUtil.getNotationElement(modelUri, domain, semanticProxyUri,
            Shape.class);
    }

    @Override
    protected void doExecute() {
        umlDiagram.getElements().remove(packageToRemove);
    }
}
