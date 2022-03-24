package com.eclipsesource.uml.modelserver.commands.objectdiagram.object;

import com.eclipsesource.uml.modelserver.commands.commons.contributions.UmlCompoundCommandContribution;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.command.CCompoundCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;

public class RemoveObjectCommandContribution extends UmlCompoundCommandContribution {

    public static final String TYPE = "removeObject";

    public static CCompoundCommand create(final String semanticUri) {
        CCompoundCommand removeObjectCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
        removeObjectCommand.setType(TYPE);
        removeObjectCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUri);
        return removeObjectCommand;
    }

  @Override
  protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
          throws DecodingException {
        String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);
        return new RemoveObjectCompoundCommand(domain, modelUri, semanticUriFragment);

  }
}
