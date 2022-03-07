package com.eclipsesource.uml.modelserver.commands.objectdiagram.object;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.InstanceSpecification;
import org.eclipse.uml2.uml.Class;

public class RemoveObjectCommand extends UmlSemanticElementCommand {

    protected final String semanticUriFragment;

    public RemoveObjectCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment) {
        super(domain, modelUri);
        this.semanticUriFragment = semanticUriFragment;
    }

    @Override
    protected void doExecute() {
        Class objectToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Class.class);
        umlModel.getPackagedElements().remove(objectToRemove);
    }
}
