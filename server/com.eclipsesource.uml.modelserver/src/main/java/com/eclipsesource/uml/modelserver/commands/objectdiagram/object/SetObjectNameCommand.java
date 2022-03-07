package com.eclipsesource.uml.modelserver.commands.objectdiagram.object;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.InstanceSpecification;

public class SetObjectNameCommand extends UmlSemanticElementCommand {

    protected String semanticUriFragment;
    protected String newName;

    public SetObjectNameCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment,
                                final String newName) {
        super(domain, modelUri);
        this.semanticUriFragment = semanticUriFragment;
        this.newName = newName;
    }

    @Override
    protected void doExecute() {
        Class objectToRename = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment,
                Class.class);
        objectToRename.setName(newName);
    }
}
