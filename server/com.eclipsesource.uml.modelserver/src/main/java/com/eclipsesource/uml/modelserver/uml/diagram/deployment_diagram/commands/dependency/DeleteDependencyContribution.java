package com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.dependency;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;
import org.eclipse.emfcloud.modelserver.edit.command.BasicCommandContribution;
import org.eclipse.uml2.uml.Dependency;
import org.eclipse.uml2.uml.NamedElement;

import com.eclipsesource.uml.modelserver.core.commands.noop.NoopCommand;
import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.codec.ContributionEncoder;

public final class DeleteDependencyContribution extends BasicCommandContribution<Command> {

   public static final String TYPE = "deployment:delete_dependency";

   public static CCommand create(final NamedElement semanticElement) {
      return new ContributionEncoder().type(TYPE).element(semanticElement).ccommand();
   }

   @Override
   protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {
      var decoder = new ContributionDecoder(modelUri, domain, command);

      var context = decoder.context();
      var element = decoder.element(Dependency.class);

      return element
         .<Command> map(e -> new DeleteDependencyCompoundCommand(context, e))
         .orElse(new NoopCommand());
   }

}
