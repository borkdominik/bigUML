package com.eclipsesource.uml.modelserver.commands.objectdiagram.attribute;

import com.eclipsesource.uml.modelserver.commands.commons.contributions.UmlSemanticCommandContribution;
import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;

public class AddAttributeCommandContribution extends UmlSemanticCommandContribution {

    public static final String TYPE = "addAttribute";

    public static CCommand create(final String parentSemanticUri) {
        CCommand addAttributeCommand = CCommandFactory.eINSTANCE.createCommand();
        addAttributeCommand.setType(TYPE);
        addAttributeCommand.getProperties().put(PARENT_SEMANTIC_URI_FRAGMENT, parentSemanticUri);
        return addAttributeCommand;
    }

    @Override
    protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
            throws DecodingException {

        String parentSemanticUriFragment = command.getProperties().get(PARENT_SEMANTIC_URI_FRAGMENT);
        return new AddAttributeCommand(domain, modelUri, parentSemanticUriFragment);
    }
}
